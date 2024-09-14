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
        clientId: payload.clientId, // Fixed: Payload keys should be directly used
        userId: payload.userId,
        totalAmount,
        orderProducts: {
          create: payload.products.map((product) => ({
            productId: product.productId,
            quantity: product.quantity,
            paidQuantity: product.paidQuantity, // Track initial paid quantity
          })),
        },
      },
      include: {
        orderProducts: true,
      },
    });

    // Check if all products have been fully paid
    const allPaid = order.orderProducts.every(
      (orderProduct) => orderProduct.paidQuantity === orderProduct.quantity,
    );

    // If all products are fully paid, mark the order as paid
    if (allPaid) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paid: true },
      });
    }

    return order;
  }

  // Method to handle partial payments
  async makePartialPayment(orderProductId: string, paidQuantity: number) {
    const orderProduct = await this.prisma.orderProduct.findUnique({
      where: { id: orderProductId },
    });

    if (!orderProduct) throw new Error('OrderProduct not found');

    const newPaidQuantity = orderProduct.paidQuantity + paidQuantity;

    if (newPaidQuantity > orderProduct.quantity) {
      throw new Error('Paid quantity exceeds the ordered quantity');
    }

    // Update the paidQuantity for the OrderProduct
    await this.prisma.orderProduct.update({
      where: { id: orderProductId },
      data: { paidQuantity: newPaidQuantity },
    });

    // Check if the related order is fully paid
    const order = await this.prisma.order.findUnique({
      where: { id: orderProduct.orderId },
      include: { orderProducts: true },
    });

    if (!order) throw new Error('Order not found');

    const allPaid = order.orderProducts.every((op) => op.paidQuantity === op.quantity);

    if (allPaid) {
      await this.prisma.order.update({
        where: { id: order.id },
        data: { paid: true },
      });
    }

    return order;
  }
}
