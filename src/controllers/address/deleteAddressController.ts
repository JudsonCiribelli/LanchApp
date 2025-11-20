import type { Request, Response } from "express";
import { DeleteAdressService } from "../../services/address/deleteAddressService.ts";

class DeleteAdressController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    const { addressId } = req.body;

    try {
      const deleteAdressService = new DeleteAdressService();

      const addressToDelete = await deleteAdressService.execute({
        userId,
        addressId,
      });

      return res.status(200).send({ addressToDelete });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { DeleteAdressController };
