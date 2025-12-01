import type { Request, Response } from "express";
import { LoginUserService } from "../../services/user/loginUserService.ts";
import z from "zod";

class LoginUserController {
  async handle(req: Request, res: Response) {
    const loginUserSchema = z.object({
      email: z.email().nonempty({ message: "Email is required!" }),
      password: z
        .string()
        .min(8, { message: "The password must be at least 8 characters long" }),
    });

    try {
      const { email, password } = loginUserSchema.parse(req.body);

      const loginUserService = new LoginUserService();

      const login = await loginUserService.execute({ email, password });

      return res.status(200).send({ login });
    } catch (error) {
      console.log(error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation error",
          issues: error.format(),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { LoginUserController };
