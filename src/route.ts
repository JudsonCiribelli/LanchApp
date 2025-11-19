import { Router } from "express";
import { CreateUserController } from "./controllers/user/createUserController.ts";
import { LoginUserController } from "./controllers/user/LoginUserController.ts";

const router = Router();

//User
router.post("/user", new CreateUserController().handle);
router.post("/session", new LoginUserController().handle);

export { router };
