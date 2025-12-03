import type { Request, Response } from "express";
import { CreateAddressesService } from "../../services/address/createAddressService.ts";
import z from "zod";

class CreateAddressesController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const createAddressSchema = z.object({
      street: z.string().nonempty({ message: "Street field is required!" }),
      number: z.string(),
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
          message: "ZIP CODE INVALID. It must contain 8 digits",
        }),
    });

    try {
      const { street, number, complement, neighborhood, city, state, zipCode } =
        createAddressSchema.parse(req.body);

      const createAddressesService = new CreateAddressesService();

      const address = await createAddressesService.execute({
        userId,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      });

      return res.status(201).send({ address });
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
export { CreateAddressesController };
