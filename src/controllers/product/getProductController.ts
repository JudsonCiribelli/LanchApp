import type { Request, Response } from "express";
import { GetProductService } from "../../services/product/getProductService.ts";

class GetProductController {
  async handle(req: Request, res: Response) {
    try {
      const getProductService = new GetProductService();

      const products = await getProductService.execute();
      return res.status(200).send({ products });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { GetProductController };
