import type { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/removeItemService.ts";

class RemoveItemController {
  async handle(req: Request, res: Response) {
    const itemId = req.query.itemId as string;
    try {
      const removeItemService = new RemoveItemService();

      const itemToDelete = await removeItemService.execute({ itemId });

      return res.status(200).send({ itemToDelete });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { RemoveItemController };
