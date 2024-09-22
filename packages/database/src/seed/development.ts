import bcrypt from 'bcryptjs';

import { prisma } from '../client.js';

export default async function seedDev() {
  await prisma.user.create({
    data: {
      password: bcrypt.hashSync('passer'),
      username: 'admin',
      role: 'ADMIN',
    },
  });
  await prisma.user.create({
    data: {
      password: bcrypt.hashSync('passer'),
      username: 'user',
      role: 'USER',
    },
  });
  await prisma.product.create({
    data: {
      name: 'Product 1',
      price: 100,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Product 2',
      price: 200,
    },
  });
  await prisma.product.create({
    data: {
      name: 'Product 3',
      price: 300,
    },
  });
  await prisma.client.create({
    data: {
      name: 'client 1',
      phone: '12345678',
    },
  });
}
