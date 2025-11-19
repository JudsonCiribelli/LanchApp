import type { Request, Response } from "express";
import { CreateUserService } from "../../services/user/createUserService.ts";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password, phone } = req.body;

    try {
      const createUserService = new CreateUserService();

      const user = await createUserService.execute({
        name,
        email,
        password,
        phone,
      });

      return res.status(201).send({ user });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { CreateUserController };
