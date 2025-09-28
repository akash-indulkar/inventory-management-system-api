import prisma from "../config/db";
import { SupplierInput, UpdateSupplierInput } from "../validators/supplier.schema";
import { SupplierResponseDTO } from "../DTO/Supplier.dto";
import { toSupplierDTO, toSupplierDTOs } from "../utils/mapper/supplier.mapper";

export async function addSupplier(data: SupplierInput): Promise<SupplierResponseDTO> {
  const existing = await prisma.supplier.findUnique({ where: { email: data.email } });
  if (existing) throw new Error("Supplier with this email already exists");
  const supplier = await prisma.supplier.create({ data });
  return toSupplierDTO(supplier);
}

export async function deleteSupplier(id: string): Promise<string> {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw new Error("Supplier not found");
  const deleted = await prisma.supplier.delete({ where: { id } });
  return deleted.id;
}

export async function updateSupplier(id: string, data: UpdateSupplierInput): Promise<SupplierResponseDTO> {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw new Error("Supplier not found");
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, v]) => v !== undefined)
  );
  const updatedSupplier = await prisma.supplier.update({ where: { id }, data: cleanData });
  return toSupplierDTO(updatedSupplier);
}

export async function getAllSuppliers(page: number, limit: number): Promise<{ data: SupplierResponseDTO[], total: number }> {
  const skip = (page - 1) * limit;
  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({ skip, take: limit, orderBy: { createdAt: "desc" } }),
    prisma.supplier.count(),
  ]);
  return { data: toSupplierDTOs(suppliers), total };
}

export async function getSupplierById(id: string): Promise<SupplierResponseDTO> {
  const supplier = await prisma.supplier.findUnique({ where: { id } });
  if (!supplier) throw new Error("Supplier not found");
  return toSupplierDTO(supplier);
}