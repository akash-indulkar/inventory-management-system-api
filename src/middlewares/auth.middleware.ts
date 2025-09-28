
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(403).json({ message: "Token missing" });
        }
        jwt.verify(token, process.env.JWT_SECRET!, (err, admin) => {
            if (err) {
                res.status(403).json({ message: "Authentication failed!", err })
            } else {
                if (typeof admin == "string" || !admin) {
                    res.status(403).json({ message: "Authentication failed!", err })
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
