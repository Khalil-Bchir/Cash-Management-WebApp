import { FastifyPluginAsync } from 'fastify';

import { OrderSchema } from '../../../schemas/order.js';
import { OrderService } from '../../../services/order.js';
import { InitOrderPayload } from '../../../types/order.js';

const orderRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { prisma } = fastify;
  const orderService = new OrderService({ prisma });

  // Create a new order
  fastify.post<{ Body: InitOrderPayload }>(
    '/init',
    { schema: OrderSchema.InitOrder },
    async (request, reply) => {
      try {
        const payload: InitOrderPayload = request.body;

        // Initialize the order using the OrderService
        await orderService.initializeOrder(payload);

        reply.status(201).send({ message: 'Order created successfully' });
      } catch (error) {
        console.error('Error creating order:', error);
        throw error;
      }
    },
  );

  // Route to make a partial payment
  fastify.post<{ Body: { orderId: string; handedAmount: number } }>(
    '/pay',
    { schema: OrderSchema.PayOrder },
    async (request, reply) => {
      try {
        const { orderId, handedAmount } = request.body;

        // Process partial payment using the OrderService
        await orderService.addPayment(orderId, handedAmount);

        reply.status(200).send({ message: 'Payment processed successfully' });
      } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
      }
    },
  );

  fastify.get<{ Params: { orderId: string } }>(
    '/:orderId',
    { schema: OrderSchema.GetOrderByID },
    async (request, reply) => {
      try {
        const { orderId } = request.params;

        // Fetch the order using the OrderService
        const order = await orderService.getOrderbyId(orderId);

        return reply.send(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
      }
    },
  );

  // Route to fetch orders
  fastify.get<{
    Querystring: {
      page: number;
      limit: number;
      date?: string;
      restToPay?: number;
      search?: string;
    };
  }>('/', { schema: OrderSchema.GetOrders }, async (request, reply) => {
    try {
      const { page, limit, date, restToPay, search } = request.query;

      if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        throw new Error('Invalid page or limit');
      }

      // Fetch orders using the OrderService
      const result = await orderService.getOrders(page, limit, {
        date,
        restToPay,
        search,
      });

      return reply.send(result);
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  });

  // Route to mark an order as delivered
  fastify.post<{ Params: { orderId: string } }>(
    '/deliver/:orderId',
    { schema: OrderSchema.DeliverOrder }, // Ensure you have this schema defined
    async (request, reply) => {
      try {
        const { orderId } = request.params;

        // Mark the order as delivered using the OrderService
        await orderService.markAsDelivered(orderId);

        reply.status(200).send({ message: 'Order marked as delivered' });
      } catch (error) {
        console.error('Error marking order as delivered:', error);
        reply.status(500).send({ message: 'Failed to mark order as delivered' });
      }
    },
  );
};

export default orderRoutes;
