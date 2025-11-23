import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import examRoutes from "./routes/exams";
import { config } from "./config";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/exams", examRoutes);

app.listen(config.port, () => {
  console.log(`API PinkScan rodando na porta ${config.port}`);
});
