import type { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/removeItemService.ts";
import z from "zod";

class RemoveItemController {
  async handle(req: Request, res: Response) {
    try {
      const itemId = req.query.itemId as string;

      const removeItemService = new RemoveItemService();

      const itemToDelete = await removeItemService.execute({ itemId });

      return res.status(200).send({ itemToDelete });
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

export { RemoveItemController };
