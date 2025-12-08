import type { Request, Response } from "express";
import { GetProductService } from "../../services/product/getProductService.ts";

class GetProductController {
  async handle(req: Request, res: Response) {
    try {
      const getProductService = new GetProductService();

      const products = await getProductService.execute();

      return res.status(200).send({ products });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { GetProductController };
