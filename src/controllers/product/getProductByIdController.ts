import type { Request, Response } from "express";
import { GetProductByIdService } from "../../services/product/getProductByIdService.ts";
import z from "zod";

class GetProductByIdController {
  async handle(req: Request, res: Response) {
    const categoryId = req.query.categoryId as string;

    if (!categoryId) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    try {
      const getProductByIdService = new GetProductByIdService();

      const category = await getProductByIdService.execute({ categoryId });

      return res.status(200).send({ category });
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

export { GetProductByIdController };
