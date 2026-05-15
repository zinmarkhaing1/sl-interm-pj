import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?:  jwt.JwtPayload & {id : string};
}
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is missing" });
      return;
    }

    let token = req.header("Authorization");
    if (!token) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {id : string};
    req.user = verified;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid token";
    res.status(401).json({ message });
  }
};
