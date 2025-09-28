import prisma from "../config/db";
import { ProductResponseDTO } from "../DTO/Product.dto";
import { Product } from "../generated/prisma";
import { ProductInput, UpdateProductInput } from "../validators/product.schema";

export async function addProduct(data: ProductInput): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { name: data.name } })
    if (existingProduct) throw new Error("Product already exists, please update existing product!")

    const product = await prisma.product.create({
        data: {
            name: data.name,
            description: data.description,
            stockQuantity: data.stockQuantity,
            lowStockThreshold: data.lowStockThreshold,
            price: data.price,
            category: data.category,
            supplierId: data.supplierId
        }
    });
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        supplierId: product.supplierId,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export async function deleteProduct(id: string): Promise<string> {
    const existingProduct = await prisma.product.findUnique({ where: { id: id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    const product = await prisma.product.delete({ where: { id } })
    return product.id;
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    const cleanData = Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== undefined)
    );
    if (Object.keys(cleanData).length === 0) {
        throw new Error("No valid fields provided for update");
    }
    const product = await prisma.product.update({
        where: { id },
        data: cleanData
    });
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        supplierId: product.supplierId,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export async function increaseStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    const product = await prisma.product.update({
        where: { id },
        data: { stockQuantity: { increment: quantity } },
    });
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        supplierId: product.supplierId,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export async function decreaseStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    if (existingProduct.stockQuantity < quantity) throw new Error("Insufficient stock to decrease by the specified quantity!")
    const product = await prisma.product.update({
        where: { id },
        data: { stockQuantity: { decrement: quantity } },
    });
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        supplierId: product.supplierId,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}

export async function getAllProducts(page: number, limit: number, filters?: any): Promise<{ data: ProductResponseDTO[], total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.name) where.name = { contains: filters.name, mode: "insensitive" };
    if (filters?.category) where.category = filters.category;
    if (filters?.supplierId) where.supplierId = filters.supplierId;

    const [products, total] = await Promise.all([
        prisma.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.product.count({ where }),
    ]);

    const data: ProductResponseDTO[] = products.map((p: Product) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        stockQuantity: p.stockQuantity,
        lowStockThreshold: p.lowStockThreshold,
        price: p.price,
        category: p.category,
        supplierId: p.supplierId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
    }));

    return { data, total };
}

export async function getProductById(id: string): Promise<ProductResponseDTO> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product does not exist, please provide a valid ID!");
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        supplierId: product.supplierId,
        stockQuantity: product.stockQuantity,
        lowStockThreshold: product.lowStockThreshold,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}
