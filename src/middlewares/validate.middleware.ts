import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      return res.status(400).json({
        status: "Bad Input",
        fields: err.issues.map((e: any) => e.path.join(".")).join(", "),
        message: err.issues.map((e: any) => e.message).join(", ")
      });
    }
  };
}
