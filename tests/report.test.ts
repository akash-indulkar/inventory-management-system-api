jest.mock('../src/config/db.config', () => ({
    __esModule: true,
    default: require('../src/config/__mocks__/db.config').prisma,
}));

import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db.config";
import jwt from "jsonwebtoken";

const testUser = { id: "123", email: "testadmin@example.com" };
const jwtToken = `${jwt.sign(testUser, process.env.JWT_SECRET!, { expiresIn: "1h" })}`;

describe("Report Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("GET /reports/stock - should return low stock products", async () => {
        const lowStockProducts = [
            {
                id: "76b1b96a-5825-45e3-8d47-62aaf3d8c4bb",
                name: "Colgate toothpaste",
                description: "white",
                price: 100,
                category: "Consumer",
                supplierId: "e59cfaa5-5823-4458-b89c-ae19f692a760",
                stockQuantity: 2,
                lowStockThreshold: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        (prisma.product.findMany as jest.Mock).mockResolvedValue(lowStockProducts);

        const res = await request(app)
            .get("/reports/stock")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: lowStockProducts, total: lowStockProducts.length });
    });

    it("GET /reports/stock - should return empty array if no products found", async () => {
        const allProducts = [
            {
                id: "76b1b96a-5825-45e3-8d47-62aaf3d8c4bb",
                name: "Colgate toothpaste",
                description: "white",
                price: 100,
                category: "Consumer",
                supplierId: "e59cfaa5-5823-4458-b89c-ae19f692a760",
                stockQuantity: 10,
                lowStockThreshold: 3,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];
        (prisma.product.findMany as jest.Mock).mockResolvedValue(allProducts);

        const res = await request(app)
            .get("/reports/stock")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
        expect(res.body.total).toBe(0);
    });

    it("GET /reports/suppliers - should return products grouped by supplier", async () => {
        (prisma.supplier.findMany as jest.Mock).mockResolvedValue([
            {
                id: "d6890e85-aec7-4152-9510-8de70cab9f5b",
                name: "Ganesh Enterprises",
                email: "ganeshenterprises@gmail.com",
                phone: "21145 85462",
                address: "Ghatkopar, Mumbai",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                products: [
                    {
                        id: "322dbb14-3f61-433c-96e6-295dbbeda116",
                        name: "Colgate Toothpaste",
                        description: "white",
                        price: 100,
                        category: "Consumer",
                        supplierId: "d6890e85-aec7-4152-9510-8de70cab9f5b",
                        stockQuantity: 2,
                        lowStockThreshold: 3,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    },
                ],
            },
        ]);

        const res = await request(app)
            .get("/reports/suppliers")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("supplier");
        expect(res.body[0].supplier).toHaveProperty("name", "Ganesh Enterprises");
        expect(Array.isArray(res.body[0].products)).toBe(true);
        expect(res.body[0].products[0]).toHaveProperty("name", "Colgate Toothpaste");
    });

    it("GET /reports/suppliers - should return empty array if no suppliers found", async () => {
        (prisma.supplier.findMany as jest.Mock).mockResolvedValue([]);

        const res = await request(app)
            .get("/reports/suppliers")
            .set("Authorization", `Bearer ${jwtToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });
});
