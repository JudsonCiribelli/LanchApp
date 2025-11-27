import type { Request, Response } from "express";
import { CreateAddressesService } from "../../services/address/createAddressService.ts";
import z from "zod";

class CreateAddressesController {
  async handle(req: Request, res: Response) {
    const createAddressSchema = z.object({
      street: z.string().nonempty({ message: "Street field is required!" }),
      number: z.number(),
      complement: z
        .string()
        .nonempty({ message: "Complement field is required!" }),
      neighborhood: z
        .string()
        .nonempty({ message: "Neighborhood field is required!" }),
      city: z.string().nonempty({ message: "City field is required!" }),
      state: z.string().nonempty({ message: "State field is required!" }),
      zipCode: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 8, {
          message: "CEP inválido. Deve conter 8 dígitos.",
        }),
    });

    const { street, number, complement, neighborhood, city, state, zipCode } =
      createAddressSchema.parse(req.body);

    const userId = req.userId;

    try {
      const createAddressesService = new CreateAddressesService();

      const addresses = await createAddressesService.execute({
        userId,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      });

      return res.status(201).send({ addresses });
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
export { CreateAddressesController };
