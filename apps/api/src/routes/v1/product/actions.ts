import { FastifyPluginAsync } from 'fastify';

import { ProductSchema } from '../../../schemas/product.js';
import { ProductService } from '../../../services/product.js';
import { ProductPayload } from '../../../types/product.js';

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { prisma } = fastify;
  const productService = new ProductService({ prisma });

  // Get a single product by ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: ProductSchema.getProduct },
    async (request, reply) => {
      try {
        const data = await productService.getProductData(request.params.id);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Create a new product
  fastify.post<{ Body: ProductPayload }>(
    '/',
    { schema: ProductSchema.createProduct },
    async (request, reply) => {
      try {
        const data = await productService.createProduct(request.body);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Update a product by ID
  fastify.put<{ Params: { id: string }; Body: Partial<ProductPayload> }>(
    '/:id',
    { schema: ProductSchema.updateProduct },
    async (request, reply) => {
      try {
        const data = await productService.updateProduct(request.params.id, request.body);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Delete a product by ID
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { schema: ProductSchema.deleteProduct },
    async (request, reply) => {
      try {
        await productService.deleteProduct(request.params.id);
        return reply.code(200).send({ status: 'success', message: 'Product deleted successfully' });
      } catch (err) {
        throw err;
      }
    },
  );

  // Get all products (optional pagination)
  fastify.get('/', { schema: ProductSchema.getAllProducts }, async (request, reply) => {
    try {
      const { skip, take } = request.query as { skip?: number; take?: number };
      const data = await productService.getAllProducts(skip, take);
      return reply.code(200).send(data);
    } catch (err) {
      throw err;
    }
  });
};

export default routes;
