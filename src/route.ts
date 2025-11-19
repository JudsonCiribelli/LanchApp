import { Router } from "express";
import { CreateUserController } from "./controllers/user/createUserController.ts";

const router = Router();

router.get("/user", new CreateUserController().handle);

export { router };
