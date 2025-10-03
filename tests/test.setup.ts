import prisma from "../src/config/db.config";
import { redisClient } from "../src/config/redis.config";

beforeEach(async () => {
  await prisma.admin.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
  await redisClient.quit();
  jest.clearAllTimers();
});