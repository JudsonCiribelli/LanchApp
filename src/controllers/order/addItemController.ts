import type { Request, Response } from "express";
import { AddItemService } from "../../services/order/addItemService.ts";
import z from "zod";

class AddItemController {
  async handle(req: Request, res: Response) {
    const addItemSchema = z.object({
      orderId: z.uuid().nonempty({ message: "Order Id is required!" }),
      productId: z.uuid().nonempty({ message: "Product Id is required!" }),
      unitPrice: z.string().nonempty({ message: "Unit price is required!" }),
      amount: z.number().min(1),
    });

    try {
      const { orderId, productId, unitPrice, amount } = addItemSchema.parse(
        req.body
      );

      const addItemService = new AddItemService();

      const item = await addItemService.execute({
        orderId,
        productId,
        unitPrice,
        amount,
      });

      return res.status(201).send({ item });
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
export { AddItemController };
