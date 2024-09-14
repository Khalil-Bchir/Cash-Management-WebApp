export const ClientSchema = {
  getClient: {
    tags: ['Client'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          status: { type: 'number', default: 500 },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },

  createClient: {
    tags: ['Client'],
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
      },
      required: ['name', 'phone'],
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          status: { type: 'number', default: 500 },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },

  updateClient: {
    tags: ['Client'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          status: { type: 'number', default: 500 },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },

  deleteClient: {
    tags: ['Client'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Successful deletion response',
        type: 'object',
        properties: {
          status: { type: 'string', default: 'success' },
          message: { type: 'string' },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          status: { type: 'number', default: 500 },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },

  getAllClients: {
    tags: ['Client'],
    querystring: {
      type: 'object',
      properties: {
        skip: { type: 'number' },
        take: { type: 'number' },
      },
    },
    response: {
      200: {
        description: 'Successful response',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            phone: { type: 'string' },
          },
        },
      },
      '4xx': {
        type: 'object',
        properties: {
          status: { type: 'number' },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Error response',
        type: 'object',
        properties: {
          status: { type: 'number', default: 500 },
          code: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};
