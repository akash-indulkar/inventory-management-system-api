jest.mock('../src/config/mailer.config');
jest.mock('../src/config/redis.config');
jest.mock('../src/config/db.config', () => ({
  __esModule: true,
  default: require('../src/config/__mocks__/db.config').prisma,
}));

import request from 'supertest';
import app from '../src/app';
import { redisClient } from '../src/config/redis.config';
import { sendEmail } from '../src/config/mailer.config';
import prisma from "../src/config/db.config";
import bcrypt from "bcryptjs";

describe('Admin API Endpoints', () => {
  let jwtToken: string;

  const adminData = {
    name: 'Test Admin',
    email: 'testadmin@example.com',
    password: 'Password123!',
  };

  const OTP = '123456';

  beforeEach(() => {
    jest.clearAllMocks();

    (redisClient.get as jest.Mock).mockReset();
    (redisClient.set as jest.Mock).mockReset();
    (redisClient.incr as jest.Mock).mockReset();
  });

  it('POST /admin/signup - should send OTP to email', async () => {
    const res = await request(app)
      .post('/admin/signup')
      .set('Content-Type', 'application/json')
      .send(adminData)
      .expect(200);

    expect(res.body).toEqual({ message: 'Signup otp sent to your email' });
    expect(redisClient.set).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith(
      adminData.email,
      expect.any(String),
      expect.stringContaining("Your OTP for signup is:"),
      expect.any(String)
    );
  });

  it('POST /admin/signup/verify - should verify OTP and create admin', async () => {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    (redisClient.get as jest.Mock).mockImplementation(async (key: string) => {
      switch (key) {
        case `admin:signup:otp:${adminData.email}`:
          return OTP;
        case `admin:signup:name:${adminData.email}`:
          return adminData.name;
        case `admin:signup:password:${adminData.email}`:
          return hashedPassword;
        default:
          return null;
      }
    });

    (prisma.admin.create as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Test Admin",
      email: "testadmin@example.com",
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/admin/signup/verify')
      .set('Content-Type', 'application/json')
      .send({ email: adminData.email, otp: OTP })
      .expect(201);

    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data.name).toBe(adminData.name);
    expect(res.body.data.email).toBe(adminData.email);
    expect(res.body).toHaveProperty('token');

    jwtToken = res.body.token;
  });

  it('POST /admin/signup/verify - should fail for wrong OTP', async () => {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    (redisClient.get as jest.Mock).mockImplementation(async (key: string) => {
      switch (key) {
        case `admin:signup:otp:${adminData.email}`:
          return OTP;
        case `admin:signup:name:${adminData.email}`:
          return adminData.name;
        case `admin:signup:password:${adminData.email}`:
          return hashedPassword;
        default:
          return null;
      }
    });

    (prisma.admin.create as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Test Admin",
      email: "testadmin@example.com",
      password: hashedPassword,
    });

    const res = await request(app)
      .post('/admin/signup/verify')
      .set('Content-Type', 'application/json')
      .send({ email: adminData.email, otp: '000000' })
      .expect(400);

    expect(res.body.error).toBe('Invalid or expired OTP');
  });

  it('POST /admin/login - should return JWT token', async () => {
     const hashedPassword = await bcrypt.hash(adminData.password, 10);
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      name: "Test Admin",
      email: "testadmin@example.com",
      password: hashedPassword,
    });
    const res = await request(app)
      .post('/admin/login')
      .set('Content-Type', 'application/json')
      .send({ email: adminData.email, password: adminData.password })
      .expect(200);

    expect(res.body).toHaveProperty('token');
    jwtToken = res.body.token;
  });

  it('POST /admin/password-reset/request - should send OTP', async () => {
    const res = await request(app)
      .post('/admin/password-reset/request')
      .set('Content-Type', 'application/json')
      .send({ email: adminData.email })
      .expect(200);

    expect(res.body).toEqual({ message: 'Password reset OTP sent to your email' });
    expect(sendEmail).toHaveBeenCalled();
  });

  it('POST /admin/password-reset/confirm - should reset password', async () => {
    (redisClient.get as jest.Mock).mockImplementation(async(key : string) => {
      if(key == `admin:reset:otp:${adminData.email}`){
        return OTP;
      }
    })
    const res = await request(app)
      .post('/admin/password-reset/confirm')
      .set('Content-Type', 'application/json')
      .send({ email: adminData.email, otp: OTP, newPassword: 'NewPassword123!' })
      .expect(200);

    expect(res.body).toEqual({ message: 'Password updated successfully' });
  });

  it('GET /admin/profile - should return profile with valid JWT', async () => {
    const res = await request(app)
      .get('/admin/profile')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(adminData.name);
    expect(res.body.email).toBe(adminData.email);
  });

  it('GET /admin/profile - should fail with invalid JWT', async () => {
    const res = await request(app)
      .get('/admin/profile')
      .set('Authorization', 'Bearer invalidtoken')
      .expect(403);

    expect(res.body.message).toBe('Authentication failed!');
  });
});
