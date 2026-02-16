import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.ts";

export const limiter = rateLimit({
  windowMs: 20 * 60 * 1000, // Janela de 20 minutos
  max: 150, // Limite de 150 requisições por IP nesta janela
  message: {
    status: "error",
    message:
      "Muitas requisições vindas deste IP, tente novamente em 20 minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(
      `⚠️ [RATE LIMIT] Bloqueado: ${req.ip} tentou acessar ${req.url}`,
    );
    res.status(options.statusCode).send(options.message);
  },
});
