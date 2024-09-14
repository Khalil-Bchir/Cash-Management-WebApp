import { PrismaClient } from '@saas-monorepo/database';

import { ProductPayload } from '../types/product.js';
import { AbstractServiceOptions } from '../types/services.js';

export class ProductService {
  prisma: PrismaClient;

  constructor(options: AbstractServiceOptions) {
    this.prisma = options.prisma;
  }

  // Get a single product by ID
  async getProductData(id: string) {
    try {
      return await this.prisma.product.findUniqueOrThrow({
        where: { id },
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Create a new product
  async createProduct(data: ProductPayload) {
    try {
      return await this.prisma.product.create({
        data,
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Update product data by ID
  async updateProduct(id: string, data: Partial<ProductPayload>) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data,
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Delete a product by ID
  async deleteProduct(id: string) {
    try {
      return await this.prisma.product.delete({
        where: { id },
      });
    } catch (err: any) {
      throw err;
    }
  }

  // Get all products (optional pagination)
  async getAllProducts(skip?: number, take?: number) {
    try {
      return await this.prisma.product.findMany({
        skip,
        take,
      });
    } catch (err: any) {
      throw err;
    }
  }
}
