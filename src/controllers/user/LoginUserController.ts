import type { Request, Response } from "express";
import { LoginUserService } from "../../services/user/loginUserService.ts";

class LoginUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const loginUserService = new LoginUserService();
      const login = await loginUserService.execute({ email, password });

      return res.status(200).send({ login });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { LoginUserController };
