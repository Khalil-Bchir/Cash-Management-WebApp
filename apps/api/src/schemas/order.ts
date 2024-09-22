export const OrderSchema = {
  InitOrder: {
    tags: ['Orders'],
    body: {
      type: 'object',
      required: ['clientId', 'userId', 'products'],
      properties: {
        clientId: { type: 'string' },
        userId: { type: 'string' },
        handedAmount: { type: 'number', default: 0 }, // Added handedAmount field
        products: {
          type: 'array',
          items: {
            type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: { type: 'string' },
              quantity: { type: 'number' },
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
      required: ['orderId', 'handedAmount'],
      properties: {
        orderId: { type: 'string' },
        handedAmount: { type: 'number' },
      },
    },
  },

  // Schema for the /:orderId route
  GetOrderByID: {
    tags: ['Orders'],
    params: {
      type: 'object',
      required: ['orderId'],
      properties: {
        orderId: { type: 'string' },
      },
    },
    Response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          clientId: { type: 'string' },
          userId: { type: 'string' },
          totalAmount: { type: 'number' },
          restToPay: { type: 'number' },
          orderProducts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                productId: { type: 'string' },
                quantity: { type: 'number' },
              },
            },
          },
        },
      },
    },
  },

  // Schema for the GET /orders route
  GetOrders: {
    tags: ['Orders'],
    querystring: {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, default: 10 },
        date: { type: 'string', format: 'date' },
        restToPay: { type: 'number' },
        search: { type: 'string' },
      },
    },
    Response: {
      200: {
        type: 'object',
        properties: {
          orders: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                clientId: { type: 'string' },
                userId: { type: 'string' },
                totalAmount: { type: 'number' },
                restToPay: { type: 'number' },
                orderProducts: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      productId: { type: 'string' },
                      quantity: { type: 'number' },
                    },
                  },
                },
              },
            },
          },
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
        },
      },
    },
  },

  // Schema for the /deliver/:orderId route
  DeliverOrder: {
    tags: ['Orders'],
    params: {
      type: 'object',
      required: ['orderId'],
      properties: {
        orderId: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
};
