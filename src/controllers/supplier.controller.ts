import { Request, Response } from "express";
import * as supplierService from "../services/supplier.service";
import { SupplierInput, UpdateSupplierInput } from "../validators/supplier.schema";

export async function addSupplier(req: Request, res: Response) {
  try {
    const data: SupplierInput = req.body;
    const supplier = await supplierService.addSupplier(data);
    res.status(201).json(supplier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteSupplier(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const supplierId = await supplierService.deleteSupplier(id);
    res.json({ message: "Supplier deleted", id: supplierId });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateSupplier(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data: UpdateSupplierInput = req.body;
    const supplier = await supplierService.updateSupplier(id, data);
    res.json(supplier);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllSuppliers(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await supplierService.getAllSuppliers(page, limit);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getSupplierById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const supplier = await supplierService.getSupplierById(id);
    res.json(supplier);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
