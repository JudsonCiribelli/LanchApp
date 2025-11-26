import type { Request, Response } from "express";
import { CreateUserService } from "../../services/user/createUserService.ts";
import z from "zod";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const createUserSchema = z.object({
      name: z.string().min(1).nonempty({ message: "Name is required!" }),
      email: z.email().nonempty({ message: "Email is required!" }),
      password: z
        .string()
        .min(8, { message: "The password must be at least 8 characters long" }),
      phone: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 11, {
          message: "O telefone deve ter 11 dígitos (DDD + 9xxxx-xxxx)",
        })
        .refine((val) => /^[1-9]{2}9[0-9]{8}$/.test(val), {
          message: "Número de celular inválido.",
        }),
    });

    const { name, email, password, phone } = createUserSchema.parse(req.body);

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
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation error",
          issues: error.format(),
        });
      }
      return res.status(400).send(error);
    }
  }
}

export { CreateUserController };
