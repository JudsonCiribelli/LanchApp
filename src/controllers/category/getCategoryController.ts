import type { Request, Response } from "express";
import { GetCategoryService } from "../../services/category/getCategoryService.ts";

class GetCategoryController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    try {
      const getCategoryService = new GetCategoryService();

      const category = await getCategoryService.execute({
        userId,
      });

      return res.status(200).send(category);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(400).send(error);
    }
  }
}

export { GetCategoryController };
