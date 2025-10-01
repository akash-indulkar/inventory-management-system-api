import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { adminLoginSchema, adminSignupSchema, adminSignupVerifySchema, passwordResetConfirmSchema, passwordResetRequestSchema } from "../validators/admin.schema";

const router = Router();

router.post("/signup", validate(adminSignupSchema), adminController.signupAdmin);
router.post("/signup/verify", validate(adminSignupVerifySchema), adminController.createAdmin);
router.post("/login", validate(adminLoginSchema), adminController.loginAdmin);
router.post("/password-reset/request", validate(passwordResetRequestSchema), adminController.requestPasswordReset);
router.post("/password-reset/confirm", validate(passwordResetConfirmSchema), adminController.confirmPasswordReset);
router.get("/profile", authenticateJWT, adminController.getProfile);

export default router;
