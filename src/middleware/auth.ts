import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";

export interface AuthRequest extends Request {
  userId?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Token não informado" });

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.userId = decoded.userId;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}
