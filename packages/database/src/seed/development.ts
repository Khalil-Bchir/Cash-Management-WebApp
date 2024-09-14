import bcrypt from 'bcryptjs';

import { prisma } from '../client.js';

export default async function seedDev() {
  await prisma.user.create({
    data: {
      password: bcrypt.hashSync('passer'),
      username: 'admin',
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
      name: 'Product 4',
      phone: '12345678',
    },
  });
}
