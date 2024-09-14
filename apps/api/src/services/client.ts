import { PrismaClient } from '@saas-monorepo/database';

import { ClientPayload } from '../types/client.js';
import { AbstractServiceOptions } from '../types/services.js';

export class ClientService {
  prisma: PrismaClient;

  constructor(options: AbstractServiceOptions) {
    this.prisma = options.prisma;
  }

  // Get a single client by ID
  async getClientData(id: string) {
    try {
      return await this.prisma.client.findUniqueOrThrow({
        where: { id },
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Create a new client
  async createClient(data: ClientPayload) {
    try {
      return await this.prisma.client.create({
        data,
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Update client data by ID
  async updateClient(id: string, data: Partial<ClientPayload>) {
    try {
      return await this.prisma.client.update({
        where: { id },
        data,
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Delete a client by ID
  async deleteClient(id: string) {
    try {
      return await this.prisma.client.delete({
        where: { id },
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Get all clients (optional pagination)
  async getAllClients(skip?: number, take?: number) {
    try {
      return await this.prisma.client.findMany({
        skip: skip || 0,
        take: take || 10, // Default to returning 10 clients
      });
    } catch (err: any) {
      throw err;
    }
  }
}
