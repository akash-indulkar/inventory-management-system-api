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

const productData = {
    "name": "Colgate toothpaste",
    "description": "white",
    "price": 100,
    "category": "Consumer",
    "supplierId": "e59cfaa5-5823-4458-b89c-ae19f692a760",
    "stockQuantity": 10,
    "lowStockThreshold": 3
};

describe("Product API Endpoints", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("POST /products - should create a new product", async () => {
        const createdProduct = {
            id: "1153c790-1e15-488b-9b5b-4d8a961fc0fa",
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        (prisma.product.create as jest.Mock).mockResolvedValue(createdProduct);

        const res = await request(app)
            .post("/products")
            .set("Authorization", jwtToken)
            .send(productData);

        expect(res.status).toBe(201);
        expect(res.body).toEqual(createdProduct);
        expect(prisma.product.create).toHaveBeenCalledWith({ data: productData });
    });

    it("POST /products - should throw an error if product already exists", async () => {
        const existingProduct = {
            id: "1153c790-1e15-488b-9b5b-4d8a961fc0fa",
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);

        const res = await request(app)
            .post("/products")
            .set("Authorization", jwtToken)
            .send(productData);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Product already exists, please update existing product!" });
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { name: existingProduct.name } });
    });

    it("DELETE /products/:id - should delete a product", async () => {
        const productId = "b1f807f9-5352-45fa-a1cd-e1fcdeb91dfb";
        const existingProduct = {
            id: productId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);
        (prisma.product.delete as jest.Mock).mockResolvedValue({ id: productId });

        const res = await request(app)
            .delete(`/products/${productId}`)
            .set("Authorization", jwtToken);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "Product deleted successfully",
            id: productId,
        });
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
        expect(prisma.product.delete).toHaveBeenCalledWith({
            where: { id: productId },
        });
    });

    it("DELETE /products/:id - should return an error if a product does not exist", async () => {
        const productId = "b1f807f9-5352-45fa-a1cd-e1fcdeb91dfb";

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .delete(`/products/${productId}`)
            .set("Authorization", jwtToken);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "Product does not exist, please provide a valid ID!",
        });
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
    });


    it("PUT /products/:id - should update a product", async () => {
        const productId = "322dbb14-3f61-433c-96e6-295dbbeda116";
        const existingProduct = {
            id: productId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedProduct = {
            ...existingProduct,
            name: "Colgate Toothpaste"
        };
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);
        (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

        const res = await request(app)
            .put(`/products/${productId}`)
            .set("Authorization", jwtToken)
            .send({ name: "Colgate Toothpaste" });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedProduct);
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
        expect(prisma.product.update).toHaveBeenCalledWith({
            where: { id: productId },
            data: { name: "Colgate Toothpaste" },
        });
    });


    it("PUT /products/:id - should return an error if a product does not exist", async () => {
        const productId = "b1f807f9-5352-45fa-a1cd-e1fcdeb91dfb";
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app)
            .put(`/products/${productId}`)
            .set("Authorization", jwtToken)
            .send({ name: "Colgate Toothpaste" });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            error: "Product does not exist, please provide a valid ID!",
        });
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: productId } });
    });

    it("PATCH /products/:id/increase - should increase stock", async () => {
        const productId = "322dbb14-3f61-433c-96e6-295dbbeda116";
        const existingProduct = {
            id: productId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedProduct = { ...existingProduct, id: productId, stockQuantity: 20 };
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);
        (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

        const res = await request(app)
            .patch(`/products/${productId}/increase`)
            .set("Authorization", jwtToken)
            .send({ quantity: 10 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedProduct);
        expect(prisma.product.update).toHaveBeenCalled();
    });

    it("PATCH /products/:id/decrease - should decrease stock", async () => {
        const productId = "322dbb14-3f61-433c-96e6-295dbbeda116";
        const existingProduct = {
            id: productId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const updatedProduct = { ...existingProduct, stockQuantity: 5 };
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);
        (prisma.product.update as jest.Mock).mockResolvedValue(updatedProduct);

        const res = await request(app)
            .patch(`/products/${productId}/decrease`)
            .set("Authorization", jwtToken)
            .send({ quantity: 5 });

        expect(res.status).toBe(200);
        expect(res.body).toEqual(updatedProduct);
        expect(prisma.product.update).toHaveBeenCalled();
    });

    it("PATCH /products/:id/decrease - should return an error if insufficient stock is available", async () => {
        const productId = "322dbb14-3f61-433c-96e6-295dbbeda116";
        const existingProduct = {
            id: productId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(existingProduct);
        const res = await request(app)
            .patch(`/products/${productId}/decrease`)
            .set("Authorization", jwtToken)
            .send({ quantity: 15 });

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            "error": "Insufficient stock to decrease by the specified quantity!"
        });
    });

    it("GET /products - should return all products", async () => {
        const products = [
            {
                id: "322dbb14-3f61-433c-96e6-295dbbeda116",
                ...productData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        ];

        (prisma.product.findMany as jest.Mock).mockResolvedValue(products);
        (prisma.product.count as jest.Mock).mockResolvedValue(products.length);

        const res = await request(app)
            .get("/products")
            .set("Authorization", jwtToken);

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: products, total: products.length });
        expect(prisma.product.findMany).toHaveBeenCalled();
    });

    it("GET /products/:id - should return product by id", async () => {
        const productId = "b1f807f9-5352-45fa-a1cd-e1fcdeb91dfb";
        const product = {
            id: productId,
            name: "Santoor Soap",
            description: "Pack of 5",
            price: 50,
            category: "Beauty",
            supplierId: productData.supplierId,
            stockQuantity: 5,
            lowStockThreshold: 2,
            createdAt: "2025-10-01T04:34:50.752Z",
            updatedAt: "2025-10-01T04:34:50.752Z",
        };

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(product);

        const res = await request(app)
            .get(`/products/${productId}`)
            .set("Authorization", jwtToken);

        expect(res.status).toBe(200);
        expect(res.body).toEqual(product);
        expect(prisma.product.findUnique).toHaveBeenCalledWith({
            where: { id: productId },
        });
    });
}); 