import type { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/createCategoryService.ts";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const { categoryName } = req.body;
    const userId = req.userId;

    try {
      const createCategoryService = new CreateCategoryService();

      const category = await createCategoryService.execute({
        userId,
        categoryName,
      });

      return res.status(201).send({ category });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { CreateCategoryController };
