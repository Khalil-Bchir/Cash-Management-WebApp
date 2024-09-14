export const OrderSchema = {
  InitOrder: {
    tags: ['Orders'],
    body: {
      type: 'object',
      required: ['clientId', 'userId', 'products'],
      properties: {
        clientId: { type: 'string' },
        userId: { type: 'string' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            required: ['productId', 'quantity', 'paidQuantity'],
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
              paidQuantity: { type: 'number' }, // Updated from 'paid'
            },
          },
        },
      },
    },
  },
  // Schema for the /pay route
  PayOrder: {
    tags: ['Orders'],
    body: {
      type: 'object',
      required: ['orderProductId', 'paidQuantity'],
      properties: {
        orderProductId: { type: 'string' },
        paidQuantity: { type: 'number' },
      },
    },
  },
};
