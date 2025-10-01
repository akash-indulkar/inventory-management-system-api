import prisma from "../config/db.config";
import { ProductResponseDTO } from "../DTO/Product.dto";
import { SupplierResponseDTO } from "../DTO/Supplier.dto";
import { Prisma, Product } from "../generated/prisma";
import { toProductDTOs } from "../utils/mapper/product.mapper";
import { toSupplierDTO } from "../utils/mapper/supplier.mapper";

export async function getLowStockProducts(page: number, limit: number): Promise<{ data: ProductResponseDTO[], total: number }> {
    const allProducts = await prisma.product.findMany();
    const filtered = allProducts.filter((p: Product) => p.lowStockThreshold !== null && p.stockQuantity < p.lowStockThreshold);
    const total = filtered.length;
    const skip = (page - 1) * limit;
    const data = filtered.slice(skip, skip + limit);
    return {
        data: toProductDTOs(data), 
        total
    };
}

export async function getProductsGroupedBySupplier(): Promise<{ supplier: SupplierResponseDTO, products: ProductResponseDTO[] }[]> {
    const suppliers = await prisma.supplier.findMany({
        include: { products: true },
    });

    return suppliers.map((s: Prisma.SupplierGetPayload<{ include: { products: true } }>) => ({
        supplier: toSupplierDTO(s),
        products: toProductDTOs(s.products),
    }));
}