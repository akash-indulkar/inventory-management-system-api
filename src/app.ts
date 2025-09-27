import express, { type Application } from "express";
import cors from "cors";

const app : Application = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Inventory Management API is running!" });
});

export default app;