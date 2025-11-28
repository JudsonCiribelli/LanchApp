import type { Request, Response } from "express";
import { GetAddressService } from "../../services/address/getAddressService.ts";
import z from "zod";

class GetAddressController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    try {
      const getAddressService = new GetAddressService();

      const userAddresses = await getAddressService.execute({ userId });

      return res.status(200).send({ userAddresses });
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

export { GetAddressController };
