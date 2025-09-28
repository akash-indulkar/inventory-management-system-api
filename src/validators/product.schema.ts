import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    description: z.string().optional(),
    price: z.number().min(0, "Price cannot be negative"),
    category: z.string().optional(),
    supplierId: z.string().optional(),
    stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
    lowStockThreshold: z.number().min(0, "Stock quantity threshold cannot be negative").optional(),
})

export const updateProductSchema = z.object({
    name: z.string().min(2, "Name is too short").optional(),
    description: z.string().optional(),
    price: z.number().min(0, "Price cannot be negative").optional(),
    category: z.string().optional(),
    supplierId: z.string().optional(),
    stockQuantity: z.number().min(0, "Stock quantity cannot be negative").optional(),
    lowStockThreshold: z.number().min(0, "Stock quantity threshold cannot be negative").optional(),
});

export const stockUpdateSchema = z.object({
  quantity: z.number().min(1, "Quantity must be at least 1")
})

export type ProductInput = z.infer<typeof productSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type StockUpdateInput = z.infer<typeof stockUpdateSchema>;