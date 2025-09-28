
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
export const secretKey = "akashAdm1nsS3cr3t";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, secretKey, (err , admin) => {
            if (err) {
                res.status(403).json({ message: "Authentication faied!", err })
            } else {
                if (typeof admin == "string" || !admin) {
                    res.status(403).json({ message: "Authentication faied!", err })
                } else {
                    req.id = admin.id;
                    req.email = admin.email;
                    next();
                }
            }
        })
    } else {
        res.status(403).json({ message: "Cannot found auth token" });
    }
}
