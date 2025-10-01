import prisma from "../config/db.config";
import { ProductResponseDTO } from "../DTO/Product.dto";
import { toProductDTO, toProductDTOs } from "../utils/mapper/product.mapper";
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
    return toProductDTO(product);
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
    return toProductDTO(product);
}

export async function increaseStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    const product = await prisma.product.update({
        where: { id },
        data: { stockQuantity: { increment: quantity } },
    });
    return toProductDTO(product);
}

export async function decreaseStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) throw new Error("Product does not exist, please provide a valid ID!")
    if (existingProduct.stockQuantity < quantity) throw new Error("Insufficient stock to decrease by the specified quantity!")
    const product = await prisma.product.update({
        where: { id },
        data: { stockQuantity: { decrement: quantity } },
    });
    return toProductDTO(product);
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

    const data: ProductResponseDTO[] = toProductDTOs(products);
    return { data, total };
}

export async function getProductById(id: string): Promise<ProductResponseDTO> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) throw new Error("Product does not exist, please provide a valid ID!");
    return toProductDTO(product);
}