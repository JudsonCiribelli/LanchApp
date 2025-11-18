import { Router } from "express";

const router = Router();

router.get("/user", () => {
  return "Ola";
});

export { router };
