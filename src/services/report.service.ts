import prisma from "../config/db";
import { ProductResponseDTO } from "../DTO/Product.dto";
import { SupplierResponseDTO } from "../DTO/Supplier.dto";
import { Prisma, Product } from "../generated/prisma";

export async function getLowStockProducts(page: number, limit: number): Promise<{ data: ProductResponseDTO[], total: number }> {
    const allProducts = await prisma.product.findMany();
    const filtered = allProducts.filter((p: Product) => p.lowStockThreshold !== null && p.stockQuantity < p.lowStockThreshold);
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);
    return {
        data: data.map((p: Product) => ({
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
        })), 
        total
    };
}

export async function getProductsGroupedBySupplier(): Promise<{ supplier: SupplierResponseDTO, products: ProductResponseDTO[] }[]> {
    const suppliers = await prisma.supplier.findMany({
        include: { products: true },
    });

    return suppliers.map((s: Prisma.SupplierGetPayload<{ include: { products: true } }>) => ({
        supplier: {
            id: s.id,
            name: s.name,
            email: s.email,
            phone: s.phone,
            address: s.address,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
        },
        products: s.products.map((p: Product) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            supplierId: p.supplierId,
            stockQuantity: p.stockQuantity,
            lowStockThreshold: p.lowStockThreshold,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        })),
    }));
}