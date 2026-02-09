import type { Request, Response } from "express";
import { UpdateAddressService } from "../../services/address/updateAddressService.ts";
import z from "zod";

class UpdateAddressController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const updateAddressSchema = z.object({
      addressId: z.string().nonempty({ message: "Address id is required!" }),
      newStreet: z.string().nonempty({ message: "Street field is required!" }),
      newNumber: z.string(),
      newComplement: z
        .string()
        .nonempty({ message: "Complement field is required!" }),
      newNeighborhood: z
        .string()
        .nonempty({ message: "Neighborhood field is required!" }),
      newCity: z.string().nonempty({ message: "City field is required!" }),
      newState: z.string().nonempty({ message: "State field is required!" }),
      newZipCode: z
        .string()
        .transform((val) => val.replace(/\D/g, ""))
        .refine((val) => val.length === 8, {
          message: "ZIP CODE INVALID. It must contain 8 digits",
        }),
    });

    try {
      const {
        addressId,
        newStreet,
        newNumber,
        newComplement,
        newNeighborhood,
        newCity,
        newState,
        newZipCode,
      } = updateAddressSchema.parse(req.body);

      const updateAddressService = new UpdateAddressService();

      const updatedAddress = await updateAddressService.execute({
        newStreet,
        newNumber,
        newComplement,
        newNeighborhood,
        newCity,
        newState,
        newZipCode,
        addressId,
        userId,
      });

      return res.status(202).send(updatedAddress);
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
export { UpdateAddressController };
