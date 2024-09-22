import { PrismaClient } from '@prisma/client';

import { InitOrderPayload } from '../types/order.js';
import { AbstractServiceOptions } from '../types/services.js';

export class OrderService {
  prisma: PrismaClient;

  constructor(options: AbstractServiceOptions) {
    this.prisma = options.prisma;
  }

  async initializeOrder(payload: InitOrderPayload) {
    // Fetch product prices and calculate total amount
    const productDetails = await this.prisma.product.findMany({
      where: {
        id: { in: payload.products.map((product) => product.productId) },
      },
    });

    const totalAmount = payload.products.reduce((total, product) => {
      const productDetail = productDetails.find((p) => p.id === product.productId);
      if (!productDetail) throw new Error(`Product with ID ${product.productId} not found`);

      return total + productDetail.price * product.quantity;
    }, 0);

    // Create the order
    const order = await this.prisma.order.create({
      data: {
        clientId: payload.clientId,
        userId: payload.userId,
        totalAmount,
        handedAmount: payload.handedAmount,
        restToPay: totalAmount - payload.handedAmount,
        orderProducts: {
          create: payload.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
          })),
        },
      },
      include: {
        orderProducts: true,
      },
    });

    // Create an initial payment log if there's a handedAmount
    if (payload.handedAmount > 0) {
      await this.prisma.payment.create({
        data: {
          orderId: order.id,
          amount: payload.handedAmount,
        },
      });
    }

    return order;
  }

  // Method to handle partial payments and log them
  async addPayment(orderId: string, amount: number) {
    // Fetch the existing order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true }, // Include payments in the query
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Calculate new handedAmount and restToPay
    const newHandedAmount = order.handedAmount + amount;
    const newRestToPay = order.totalAmount - newHandedAmount;

    if (newRestToPay < 0) {
      throw new Error(
        `The payment amount exceeds the remaining balance. Max allowed payment: ${order.restToPay}`,
      );
    }

    // Record the payment in the Payment model
    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: amount,
      },
    });

    // Update the order with new handedAmount, restToPay, and paid status
    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: {
        handedAmount: newHandedAmount,
        restToPay: newRestToPay,
      },
    });

    return updatedOrder;
  }

  // Method to mark an order as delivered
  async markAsDelivered(orderId: string) {
    // Fetch the existing order
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Check if the order is fully paid
    if (order.restToPay === 0) {
      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          delivered: true,
          deleveryDate: new Date(), // Set to the current date
        },
      });
      return updatedOrder;
    } else {
      throw new Error('Order cannot be marked as delivered until fully paid.');
    }
  }

  async getOrderbyId(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true,
        client: true,
      },
    });

    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    return order;
  }

  async getOrders(
    page: number,
    limit: number,
    filters: { date?: string; restToPay?: number; search?: string },
  ) {
    // Validate the inputs
    if (page < 1 || limit < 1) {
      throw new Error('Page and limit should be positive integers.');
    }

    const skip = (page - 1) * limit;

    // Build the where clause for filtering
    const where: any = {};

    const { date, restToPay, search } = filters;

    // Handle date filter
    if (date) {
      const parsedDate = new Date(date);

      // Validate the date
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format.');
      }

      // Set start and end of the day for the date filter
      const startOfDay = new Date(parsedDate);
      startOfDay.setHours(0, 0, 0, 0); // Beginning of the day
      const endOfDay = new Date(parsedDate);
      endOfDay.setHours(23, 59, 59, 999); // End of the day

      where.createdAt = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }

    // Handle restToPay filter (ensure it's a number)
    if (typeof restToPay === 'number') {
      where.restToPay = {
        equals: restToPay,
      };
    }

    // Handle search filter (client's name, phone, or order ID)
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        {
          client: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
        {
          client: {
            phone: { contains: search, mode: 'insensitive' },
          },
        },
      ];
    }

    try {
      // Start timer to log query performance
      console.time('Prisma Query - Find Orders');

      // Fetch all matching orders (without pagination first, to search across all data)
      const allOrders = await this.prisma.order.findMany({
        where,
        include: {
          orderProducts: true,
          client: true, // Include client details if needed
        },
        orderBy: {
          createdAt: 'desc', // Order by creation date
        },
      });

      // Apply pagination to the fetched data
      const paginatedOrders = allOrders.slice(skip, skip + limit);

      // End timer and log the time taken for the query
      console.timeEnd('Prisma Query - Find Orders');

      // Get the total count of orders for pagination
      const totalCount = allOrders.length;

      // Return the result with pagination details
      return {
        orders: paginatedOrders,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error('Error in getOrders:', error);
      throw error;
    }
  }
}
