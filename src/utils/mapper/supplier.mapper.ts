import { SupplierResponseDTO } from "../../DTO/Supplier.dto";
import { Supplier } from "../../generated/prisma";

export function toSupplierDTO(supplier: Supplier): SupplierResponseDTO {
  return {
    id: supplier.id,
    name: supplier.name,
    email: supplier.email ?? undefined,
    phone: supplier.phone ?? undefined,
    address: supplier.address ?? undefined,
    createdAt: supplier.createdAt,
    updatedAt: supplier.updatedAt,
  };
}

export function toSupplierDTOs(suppliers: Supplier[]): SupplierResponseDTO[] {
  return suppliers.map(toSupplierDTO);
}