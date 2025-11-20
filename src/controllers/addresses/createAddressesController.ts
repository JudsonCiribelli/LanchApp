import type { Request, Response } from "express";
import { CreateAddressesService } from "../../services/addresses/createAddressesService.ts";

class CreateAddressesController {
  async handle(req: Request, res: Response) {
    const { street, number, complement, neighborhood, city, state, zipCode } =
      req.body;

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
      console.log(error);
      return res.status(400).send(error);
    }
  }
}
export { CreateAddressesController };
