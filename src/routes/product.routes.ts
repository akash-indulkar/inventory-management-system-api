import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { productSchema, stockUpdateSchema, updateProductSchema } from "../validators/product.schema";

const router = Router();

router.post("/", validate(productSchema), authenticateJWT, productController.addProduct);
router.delete("/:id", authenticateJWT, productController.deleteProduct);
router.put("/:id", validate(updateProductSchema), authenticateJWT, productController.updateProduct);
router.patch("/:id/increase", validate(stockUpdateSchema), authenticateJWT, productController.increaseStock);
router.patch("/:id/decrease", validate(stockUpdateSchema), authenticateJWT, productController.decreaseStock);
router.get("/", authenticateJWT, productController.getAllProducts);
router.get("/:id", authenticateJWT, productController.getProductById);

export default router;