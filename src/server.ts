import express, { type Request, type Response } from "express";
import { router } from "./route.ts";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from './swagger.json' with { type: "json" };

const server = express();

const port = 3030;

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(express.json());
server.use(router);

server.use((err: Error, req: Request, res: Response) => {
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
