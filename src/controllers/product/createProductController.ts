import type { Request, Response } from "express";
import { CreateProductService } from "../../services/product/createProductService.ts";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { categoryId, name, price, description } = req.body;
    const userId = req.userId;

    try {
      const createProductService = new CreateProductService();

      if (!req.file) {
        throw new Error("Error upload file");
      } else {
        const { filename } = req.file;
        const product = await createProductService.execute({
          userId,
          name,
          categoryId,
          price,
          description,
          banner: filename,
        });

        return res.status(201).send({ product });
      }
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { CreateProductController };
