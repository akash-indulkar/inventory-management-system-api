import dotenv from "dotenv";
dotenv.config();
import express, { type Application } from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes";
import productRoutes from "./routes/product.routes";
import reportRoutes from "./routes/report.routes";
import supplierRoutes from "./routes/supplier.routes";

const app : Application = express();

app.use(cors());
app.use(express.json());

app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/supplier", supplierRoutes);
app.use("/reports", reportRoutes);
export default app;