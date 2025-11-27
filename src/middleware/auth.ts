import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
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

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return res.status(401).json({ error: "Token não informado" });

  const [, token] = parts;
  if (!token) return res.status(401).json({ error: "Token não informado" });

  try {
    const secret = config.jwtSecret;
    if (!secret) return res.status(500).json({ error: "JWT secret not configured" });

    const decoded = jwt.verify(token, String(secret)) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.userId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.userId as string;
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido" });
  }
}