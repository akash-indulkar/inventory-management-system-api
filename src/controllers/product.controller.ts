import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { ProductInput, UpdateProductInput } from "../validators/product.schema";


export async function addProduct(req: Request, res: Response) {
  try {
    const data: ProductInput = req.body;
    const product = await productService.addProduct(data);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    await productService.deleteProduct(id);
    res.json({ message: "Product deleted successfully", id });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateProduct(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const data: UpdateProductInput = req.body;
    const product = await productService.updateProduct(id, data);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function increaseStock(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const quantity = Number(req.body.quantity);
    const product = await productService.increaseStock(id, quantity);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function decreaseStock(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const quantity = Number(req.body.quantity);
    const product = await productService.decreaseStock(id, quantity);
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getAllProducts(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filters = req.query;
    const products = await productService.getAllProducts(page, limit, filters);
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const product = await productService.getProductById(id);
    res.json(product);
  } catch (err: any) {
    res.status(404).json({ error: err.message });
  }
}
