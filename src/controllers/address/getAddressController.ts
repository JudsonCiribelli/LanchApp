import type { Request, Response } from "express";
import { GetAddressService } from "../../services/address/getAddressService.ts";

class GetAddressController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const getAddressService = new GetAddressService();

      const userAddresses = await getAddressService.execute({ userId });

      return res.status(200).send({ userAddresses });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { GetAddressController };
