import { Router } from "express";
import * as supplierController from "../controllers/supplier.controller";
import { validate } from "../middlewares/validate.middleware";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { supplierSchema, updateSupplierSchema } from "../validators/supplier.schema";

const router = Router();

router.post("/", validate(supplierSchema), authenticateJWT, supplierController.addSupplier);
router.delete("/:id", authenticateJWT, supplierController.deleteSupplier);
router.put("/:id", validate(updateSupplierSchema), authenticateJWT, supplierController.updateSupplier);
router.get("/", authenticateJWT, supplierController.getAllSuppliers);
router.get("/:id", authenticateJWT, supplierController.getSupplierById);

export default router;
