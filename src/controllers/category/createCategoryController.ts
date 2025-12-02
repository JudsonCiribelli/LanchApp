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

    const userId = req.userId;

    try {
      const { categoryName } = createCategorySchema.parse(req.body);

      const createCategoryService = new CreateCategoryService();

      const category = await createCategoryService.execute({
        userId,
        categoryName,
      });

      return res.status(201).send({ category });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation error",
          issues: error.format(),
        });
      }

      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

export { CreateCategoryController };
