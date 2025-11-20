import type { Request, Response } from "express";
import { GetAddressesService } from "../../services/addresses/getAddressesService.ts";

class GetAddressesController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const getAddressesService = new GetAddressesService();

      const userAddresses = await getAddressesService.execute({ userId });

      return res.status(200).send({ userAddresses });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { GetAddressesController };
