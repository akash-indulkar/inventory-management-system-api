jest.mock('../src/config/db.config', () => ({
  __esModule: true,
  default: require('../src/config/__mocks__/db.config').prisma,
}));

import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db.config";
import jwt from "jsonwebtoken";

const testUser = { id: "123", email: "testadmin@example.com" };
const jwtToken = `Bearer ${jwt.sign(testUser, process.env.JWT_SECRET!, { expiresIn: "1h" })}`;

const supplierData = {
  name: "Jopadevi Distributors",
  email: "jopadevidistributors@gmail.com",
  phone: "21846 06421",
  address: "Khalumbre, Pune",
};

describe("Supplier API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /supplier/ - should create a new supplier", async () => {
    const createdSupplier = {
      id: "9dd7d2ae-2895-4e20-96d8-09bf75fb026c",
      ...supplierData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (prisma.supplier.create as jest.Mock).mockResolvedValue(createdSupplier);

    const res = await request(app)
      .post("/supplier/")
      .set("Authorization", jwtToken)
      .send(supplierData);

    expect(res.status).toBe(201);
    expect(res.body).toEqual(createdSupplier);
    expect(prisma.supplier.create).toHaveBeenCalledWith({ data: supplierData });
  });

  it("DELETE /supplier/:id - should delete a supplier", async () => {
    const supplierId = "d6890e85-aec7-4152-9510-8de70cab9f5b";
    const supplier = {
      id: supplierId,
      name: "Ganesh Enterprises",
      email: "ganeshenterprises@gmail.com",
      phone: "21145 85462",
      address: "Ghatkopar, Mumbai",
      createdAt: "2025-10-01T04:33:07.802Z",
      updatedAt: "2025-10-01T04:33:07.802Z",
    };
    (prisma.supplier.findUnique as jest.Mock).mockResolvedValue(supplier);
    (prisma.supplier.delete as jest.Mock).mockResolvedValue({ id: supplierId });
    const res = await request(app)
      .delete(`/supplier/${supplierId}`)
      .set("Authorization", jwtToken);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Supplier deleted", id: supplierId });
    expect(prisma.supplier.delete).toHaveBeenCalledWith({
      where: { id: supplierId },
    });
  });

  it("PUT /supplier/:id - should update supplier", async () => {
    const supplierId = "c9e4b2b8-9dcd-421b-8ad4-6b219c27ebc8";
    const updatedSupplier = {
      id: supplierId,
      name: "Vijay sales",
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      createdAt: "2025-10-01T04:51:30.464Z",
      updatedAt: new Date().toISOString(),
    };

    (prisma.supplier.update as jest.Mock).mockResolvedValue(updatedSupplier);

    const res = await request(app)
      .put(`/supplier/${supplierId}`)
      .set("Authorization", jwtToken)
      .send({ name: "Vijay sales" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedSupplier);
    expect(prisma.supplier.update).toHaveBeenCalledWith({
      where: { id: supplierId },
      data: { name: "Vijay sales" },
    });
  });

  it("GET /supplier - should return all suppliers", async () => {
    const suppliers = [
      {
        id: "c9e4b2b8-9dcd-421b-8ad4-6b219c27ebc8",
        ...supplierData,
        createdAt: "2025-10-01T04:51:30.464Z",
        updatedAt: "2025-10-01T04:51:30.464Z",
      },
    ];

    (prisma.supplier.findMany as jest.Mock).mockResolvedValue(suppliers);
    (prisma.supplier.count as jest.Mock).mockResolvedValue(suppliers.length);

    const res = await request(app)
      .get("/supplier")
      .set("Authorization", jwtToken);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: suppliers, total: suppliers.length });
    expect(prisma.supplier.findMany).toHaveBeenCalled();
  });

  it("GET /supplier/:id - should return supplier by id", async () => {
    const supplierId = "d6890e85-aec7-4152-9510-8de70cab9f5b";
    const supplier = {
      id: supplierId,
      name: "Ganesh Enterprises",
      email: "ganeshenterprises@gmail.com",
      phone: "21145 85462",
      address: "Ghatkopar, Mumbai",
      createdAt: "2025-10-01T04:33:07.802Z",
      updatedAt: "2025-10-01T04:33:07.802Z",
    };

    (prisma.supplier.findUnique as jest.Mock).mockResolvedValue(supplier);

    const res = await request(app)
      .get(`/supplier/${supplierId}`)
      .set("Authorization", jwtToken);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(supplier);
    expect(prisma.supplier.findUnique).toHaveBeenCalledWith({
      where: { id: supplierId },
    });
  });
});
