import express, { type Request, type Response } from "express";
import { router } from "./route.ts";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" with { type: "json" };
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const server = express();

const port = 3030;

server.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

server.use(express.json());

server.use("/files", express.static(path.resolve(__dirname, "..", "tmp")));

server.use(router);

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
server.use((err: Error, req: Request, res: Response, next: any) => {
  if (err instanceof Error) {
    return res.status(400).json({
      error: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export { server };
