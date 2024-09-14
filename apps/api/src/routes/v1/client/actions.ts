import { FastifyPluginAsync } from 'fastify';

import { ClientSchema } from '../../../schemas/client.js';
import { ClientService } from '../../../services/client.js';
import { ClientPayload } from '../../../types/client.js';

const routes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const { prisma } = fastify;
  const clientService = new ClientService({ prisma });

  // Get a single client by ID
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    { schema: ClientSchema.getClient },
    async (request, reply) => {
      try {
        const data = await clientService.getClientData(request.params.id);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Create a new client
  fastify.post<{ Body: ClientPayload }>(
    '/',
    { schema: ClientSchema.createClient },
    async (request, reply) => {
      try {
        const data = await clientService.createClient(request.body);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Update a client by ID
  fastify.put<{ Params: { id: string }; Body: Partial<ClientPayload> }>(
    '/:id',
    { schema: ClientSchema.updateClient },
    async (request, reply) => {
      try {
        const data = await clientService.updateClient(request.params.id, request.body);
        return reply.code(200).send(data);
      } catch (err) {
        throw err;
      }
    },
  );

  // Delete a client by ID
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    { schema: ClientSchema.deleteClient },
    async (request, reply) => {
      try {
        await clientService.deleteClient(request.params.id);
        return reply.code(200).send({ status: 'success', message: 'Client deleted successfully' });
      } catch (err) {
        throw err;
      }
    },
  );

  // Get all clients (optional pagination)
  fastify.get('/', { schema: ClientSchema.getAllClients }, async (request, reply) => {
    try {
      const { skip, take } = request.query as { skip?: number; take?: number };
      const data = await clientService.getAllClients(skip, take);
      return reply.code(200).send(data);
    } catch (err) {
      throw err;
    }
  });
};

export default routes;
