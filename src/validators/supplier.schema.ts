import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().min(2, "Name is too short").optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type SupplierInput = z.infer<typeof supplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;
