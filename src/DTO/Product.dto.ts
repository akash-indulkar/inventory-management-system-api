export interface ProductResponseDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  supplierId?: string;
  stockQuantity: number;
  lowStockThreshold?: number;
  createdAt: Date;
  updatedAt: Date;
}