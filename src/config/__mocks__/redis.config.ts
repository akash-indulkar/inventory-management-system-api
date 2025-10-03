export const redisClient = {
  get: jest.fn(),
  set: jest.fn(),
  incr: jest.fn(),
  del: jest.fn(),
};

export default redisClient;