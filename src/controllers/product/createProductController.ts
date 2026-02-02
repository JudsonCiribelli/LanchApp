import type { Request, Response } from "express";
import { CreateProductService } from "../../services/product/createProductService.ts";
import z from "zod";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const createProductSchema = z.object({
      categoryId: z.uuid().nonempty({ message: "Category ID is required!" }),
      name: z.string().nonempty({ message: "Name is required!" }),
      price: z.string().nonempty({ message: "Price is required!" }),
      description: z.string().nonempty({ message: "Description is required" }),
    });

    try {
      const { categoryId, name, price, description } =
        createProductSchema.parse(req.body);

      const createProductService = new CreateProductService();

      if (!req.file) {
        throw new Error("Error upload file");
      } else {
        const product = await createProductService.execute({
          userId,
          name,
          categoryId,
          price,
          description,
          banner: req.file.originalname,
          imageBuffer: req.file.buffer,
        });

        return res.status(201).send({ product });
      }
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

export { CreateProductController };
