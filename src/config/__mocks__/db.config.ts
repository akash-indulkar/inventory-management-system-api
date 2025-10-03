export const prisma = {
  admin: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  product: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  },
  supplier: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn()
  },
};
