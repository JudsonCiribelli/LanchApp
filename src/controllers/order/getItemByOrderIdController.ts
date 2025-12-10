import type { Request, Response } from "express";
import { GetItemsByOrderIdService } from "../../services/order/getItemByOrderIdService.ts";
import z from "zod";

class GetItemsByOrderIdController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;
    const orderId = req.query.orderId as string;

    const getItemsByOrderIdSchema = z.object({
      orderId: z.uuid().nonempty({ message: "Order id is required!" }),
    });

    try {
      getItemsByOrderIdSchema.parse({ orderId });

      if (!orderId) {
        return res.status(400).json({ error: "Order id is required!" });
      }

      const getItems = new GetItemsByOrderIdService();

      const items = await getItems.execute({ orderId, userId });

      return res.status(200).send({ items });
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

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
export { GetItemsByOrderIdController };
