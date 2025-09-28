import express, { type Application } from "express";
import cors from "cors";
import adminRoutes from "./routes/admin.routes";

const app : Application = express();

app.use(cors());
app.use(express.json());

app.use("/admins", adminRoutes);

export default app;