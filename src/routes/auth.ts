import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config";
import type { Request, Response } from "express";

const router: ExpressRouter = Router();

// Registro
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password, hospitalName } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Campos obrigatórios faltando" });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ error: "E-mail já cadastrado" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, passwordHash, hospitalName },
  });

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "8h",
  });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      hospitalName: user.hospitalName,
    },
  });
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: "Credenciais inválidas" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Credenciais inválidas" });

  const token = jwt.sign({ userId: user.id }, config.jwtSecret, {
    expiresIn: "8h",
  });

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      hospitalName: user.hospitalName,
    },
  });
});

export default router;
