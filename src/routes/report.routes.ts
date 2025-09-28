import { Router } from "express";
import * as reportController from "../controllers/report.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.get("/stock", authenticateJWT, reportController.getLowStockProducts);
router.get("/suppliers", authenticateJWT, reportController.getProductsGroupedBySupplier);

export default router;
