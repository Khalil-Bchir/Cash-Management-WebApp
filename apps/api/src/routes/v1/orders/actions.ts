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
        reply.status(500).send({ error: 'Failed to create order' });
      }
    },
  );

  // Route to make a partial payment
  fastify.post<{ Body: { orderProductId: string; paidQuantity: number } }>(
    '/pay',
    { schema: OrderSchema.PayOrder },
    async (request, reply) => {
      try {
        const { orderProductId, paidQuantity } = request.body;

        // Process partial payment using the OrderService
        const order = await orderService.makePartialPayment(orderProductId, paidQuantity);

        reply.status(200).send({ message: 'Payment processed successfully', order });
      } catch (error) {
        console.error('Error processing payment:', error);
        throw error;
      }
    },
  );
};

export default orderRoutes;
