
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.config";
import { AdminLoginInput, AdminSignupInput, AdminSignupVerifyInput, PasswordResetConfirmInput } from "../validators/admin.schema";
import prisma from "../config/db.config";
import { AdminResponseDTO } from "../DTO/Admin.dto";
import { sendEmail } from "../config/mailer.config";
import { toAdminResponseDTO } from "../utils/mapper/admin.mapper";

export async function signupAdmin(data: AdminSignupInput): Promise<string> {
    const existingAdmin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (existingAdmin) throw new Error("Admin with this email already exists");
    const otpCount = await redisClient.get(`admin:signup:otpcount:${data.email}`);
    if (!otpCount) {
        await redisClient.set(`admin:signup:otpcount:${data.email}`, "1", "EX", 600);
    } else if (parseInt(otpCount) >= 3) {
        throw new Error("Too many OTP requests. Please try again later.");
    } else {
        await redisClient.incr(`admin:signup:otpcount:${data.email}`);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    await redisClient.set(`admin:signup:otp:${data.email}`, otp, "EX", 300);
    await redisClient.set(`admin:signup:name:${data.email}`, data.name, "EX", 300);
    await redisClient.set(`admin:signup:password:${data.email}`, hashedPassword, "EX", 300);

    await sendEmail(
        data.email,
        "Your Signup OTP",
        `Your OTP for signup is: ${otp}`,
        `<p>Your OTP for signup is: <b>${otp}</b></p>`
    );

    return "Signup OTP sent to email";
}

export async function createAdmin(data: AdminSignupVerifyInput): Promise<{ data: AdminResponseDTO, token: string }> {
    const cachedOtp = await redisClient.get(`admin:signup:otp:${data.email}`);
    if (!cachedOtp || cachedOtp !== data.otp) throw new Error("Invalid or expired OTP");
    const name = await redisClient.get(`admin:signup:name:${data.email}`);
    const password = await redisClient.get(`admin:signup:password:${data.email}`);
    if (!name || !password) throw new Error("Signup data expired. Please try again.");

    const admin = await prisma.admin.create({
        data: {
            name: name,
            email: data.email,
            password: password,
        },
    });

    await redisClient.del(`admin:signup:otp:${data.email}`);
    await redisClient.del(`admin:signup:name:${data.email}`);
    await redisClient.del(`admin:signup:password:${data.email}`);

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    return {
        data: toAdminResponseDTO(admin),
        token
    };
}

export async function loginAdmin(data: AdminLoginInput): Promise<string> {
    const admin = await prisma.admin.findUnique({ where: { email: data.email } });
    if (!admin) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(data.password, admin.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET!, { expiresIn: "1d" });
    return token;
}

export async function requestPasswordReset(email: string): Promise<string> {
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new Error("Admin not found");

    const otpCount = await redisClient.get(`admin:reset:otpcount:${email}`);
    if (!otpCount) {
        await redisClient.set(`admin:reset:otpcount:${email}`, "1", "EX", 600);
    } else if (parseInt(otpCount) >= 3) {
        throw new Error("Too many OTP requests. Please try again later.");
    } else {
        await redisClient.incr(`admin:reset:otpcount:${email}`);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(`admin:reset:otp:${email}`, otp, "EX", 300);

    await sendEmail(
        email,
        "Your Password Reset OTP",
        `Your OTP for signup is: ${otp}`,
        `<p>Your OTP for signup is: <b>${otp}</b></p>`
    )
    return "Password Reset OTP sent to email";
}

export async function confirmPasswordReset(data: PasswordResetConfirmInput): Promise<string> {
    const cachedOtp = await redisClient.get(`admin:reset:otp:${data.email}`);
    if (!cachedOtp || cachedOtp !== data.otp) throw new Error("Invalid or expired OTP");

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    await prisma.admin.update({
        where: { email: data.email },
        data: { password: hashedPassword },
    });

    await redisClient.del(`admin:reset:otp:${data.email}`);

    return "Password updated successfully";
}

export async function getProfile(adminEmail: string): Promise<AdminResponseDTO> {
    const admin = await prisma.admin.findUnique({ where: { email: adminEmail } });
    if (!admin) throw new Error("Admin not found");

    return toAdminResponseDTO(admin);
}