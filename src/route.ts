import { Router } from "express";
import { CreateUserController } from "./controllers/user/createUserController.ts";
import { LoginUserController } from "./controllers/user/LoginUserController.ts";
import { IsAuthenticated } from "./middleware/user/IsAutheticated.ts";
import { GetUserController } from "./controllers/user/getUserController.ts";

const router = Router();

//User
router.post("/user", new CreateUserController().handle);
router.post("/session", new LoginUserController().handle);
router.get("/user", IsAuthenticated, new GetUserController().handle);

export { router };
