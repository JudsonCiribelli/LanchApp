import express from "express";
import { router } from "./route.ts";

const server = express();
const port = 3000;

server.use(express.json());
server.use(router);

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

export { server };
