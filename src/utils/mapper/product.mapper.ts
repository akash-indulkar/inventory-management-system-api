import { ProductResponseDTO } from "../../DTO/Product.dto";
import { Product } from "../../generated/prisma";

export function toProductDTO(product: Product): ProductResponseDTO {
  return {
    id: product.id,
    name: product.name,
    description: product.description ?? undefined,
    price: product.price,
    category: product.category ?? undefined,
    supplierId: product.supplierId ?? undefined,
    stockQuantity: product.stockQuantity,
    lowStockThreshold: product.lowStockThreshold ?? undefined,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

export function toProductDTOs(products: Product[]): ProductResponseDTO[] {
  return products.map(toProductDTO);
}