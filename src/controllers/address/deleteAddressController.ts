import type { Request, Response } from "express";
import { DeleteAdressService } from "../../services/address/deleteAddressService.ts";
import z from "zod";

class DeleteAdressController {
  async handle(req: Request, res: Response) {
    const deleteAdressSchema = z.object({
      addressId: z.uuid().nonempty({ message: "Adress id is required!" }),
    });

    const userId = req.userId;

    try {
      const { addressId } = deleteAdressSchema.parse(req.body);

      const deleteAdressService = new DeleteAdressService();

      const addressToDelete = await deleteAdressService.execute({
        userId,
        addressId,
      });

      return res.status(200).send({ addressToDelete });
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

export { DeleteAdressController };
