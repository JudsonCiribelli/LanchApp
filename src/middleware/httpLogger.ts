import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.ts";

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.http(`[${req.method}] ${req.url} ${res.statusCode} - ${duration}ms`);
  });

  next();
}
