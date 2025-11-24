import type { Request, Response } from "express";
import { AddItemService } from "../../services/order/addItemService.ts";

class AddItemController {
  async handle(req: Request, res: Response) {
    const { orderId, productId, unitPrice, amount } = req.body;

    try {
      const addItemService = new AddItemService();

      const item = await addItemService.execute({
        orderId,
        productId,
        unitPrice,
        amount,
      });

      return res.status(201).send({ item });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}
export { AddItemController };
