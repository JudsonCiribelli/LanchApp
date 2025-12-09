import type { Response, Request } from "express";
import { RemoveOrderService } from "../../services/order/removeOrderService.ts";

class RemoveOrderController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const orderId = req.query.orderId as string;

    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required" });
    }

    try {
      const removeOrderService = new RemoveOrderService();

      const orderToDelete = await removeOrderService.execute({
        orderId,
        userId,
      });

      return res.status(200).send({ orderToDelete });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { RemoveOrderController };
