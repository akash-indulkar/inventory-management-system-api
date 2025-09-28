import { Request, Response } from "express";
import { AdminLoginInput, AdminSignupInput, AdminSignupVerifyInput, PasswordResetConfirmInput, PasswordResetRequestInput } from "../validators/admin.schema";
import * as adminService from "../services/admin.service";

export async function signupAdmin(req: Request, res: Response) {
    try {
        const data: AdminSignupInput = req.body;
        await adminService.signupAdmin(data);
        res.status(201).json({message : "Signup otp sent to your email"});
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function createAdmin(req: Request, res: Response) {
    try {
        const data: AdminSignupVerifyInput = req.body;
        const admin = await adminService.createAdmin(data);
        res.status(201).json(admin);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function loginAdmin(req: Request, res: Response) {
    try {
        const data: AdminLoginInput = req.body;
        const token = await adminService.loginAdmin(data);
        res.json({ token });
    } catch (err: any) {
        res.status(401).json({ error: err.message });
    }
}

export async function requestPasswordReset(req: Request, res: Response) {
    try {
        const data: PasswordResetRequestInput = req.body;
        await adminService.requestPasswordReset(data.email);
        res.json({ message: "Password reset OTP sent to your email" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function confirmPasswordReset(req: Request, res: Response) {
    try {
        const data: PasswordResetConfirmInput = req.body;
        await adminService.confirmPasswordReset(data);
        res.json({ message: "Password updated successfully" });
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}

export async function getProfile(req: Request, res: Response) {
    try {
        const adminEmail = req.email;
        const profile = await adminService.getProfile(adminEmail);
        res.json(profile);
    } catch (err: any) {
        res.status(400).json({ error: err.message });
    }
}
