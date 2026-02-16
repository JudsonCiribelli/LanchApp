// src/middlewares/errorHandler.ts
import type { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.ts";

export function errorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  logger.error(`[${req.method}] ${req.url} - ${err.message}`, {
    stack: err.stack,
    body: req.body,
  });

  if (err instanceof Error) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor.",
  });
}
