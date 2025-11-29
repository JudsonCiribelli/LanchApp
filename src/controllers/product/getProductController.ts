import type { Request, Response } from "express";
import { GetProductService } from "../../services/product/getProductService.ts";
import z from "zod";

class GetProductController {
  async handle(req: Request, res: Response) {
    try {
      const getProductService = new GetProductService();

      const products = await getProductService.execute();

      return res.status(200).send({ products });
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

export { GetProductController };
