import { Request, Response } from "express";
import * as reportService from "../services/report.service";

export async function getLowStockProducts(req: Request, res: Response) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await reportService.getLowStockProducts(page, limit);
        res.json(result);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getProductsGroupedBySupplier(req: Request, res: Response) {
  try {
    const result = await reportService.getProductsGroupedBySupplier();
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
