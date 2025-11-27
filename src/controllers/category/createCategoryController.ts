import type { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/createCategoryService.ts";
import z from "zod";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    const createCategorySchema = z.object({
      categoryName: z
        .string()
        .nonempty({ message: "The name of category is required" }),
    });

    const { categoryName } = createCategorySchema.parse(req.body);

    const userId = req.userId;

    try {
      const createCategoryService = new CreateCategoryService();

      const category = await createCategoryService.execute({
        userId,
        categoryName,
      });

      return res.status(201).send({ category });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({
          error: error.message,
        });
      }

      return res.status(500).json({
        error: "Internal server error",
      });
    }
  }
}

export { CreateCategoryController };
