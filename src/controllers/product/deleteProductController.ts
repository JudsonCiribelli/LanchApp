import type { Request, Response } from "express";
import z from "zod";
import { DeleteProductService } from "../../services/product/deleteProductService.ts";

class DeleteProductController {
  async handle(req: Request, res: Response) {
    const deleteProductSchema = z.object({
      productId: z.uuid().nonempty({ message: "Product id is required!" }),
    });

    const userId = req.userId;

    try {
      const { productId } = deleteProductSchema.parse(req.body);

      const deleteProductService = new DeleteProductService();

      const productToDelete = await deleteProductService.execute({
        userId,
        productId,
      });

      return res.status(200).send(productToDelete);
    } catch (error) {
      console.log(error);
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

export { DeleteProductController };
