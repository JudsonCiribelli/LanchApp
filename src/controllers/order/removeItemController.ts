import type { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/removeItemService.ts";

class RemoveItemController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    try {
      const itemId = req.query.itemId as string;

      if (!itemId) {
        return res.status(400).json({ error: "Item ID is required" });
      }

      const removeItemService = new RemoveItemService();

      const itemToDelete = await removeItemService.execute({ itemId, userId });

      return res.status(200).send({ itemToDelete });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { RemoveItemController };
