import type { Request, Response } from "express";
import { GetOrderByIdService } from "../../services/order/getOrderByIdService.ts";
import z from "zod";

class GetOrderByIdController {
  async handle(req: Request, res: Response) {
    const userId = req.userId as string;

    try {
      const orderId = req.query.orderId as string;

      if (!orderId) {
        return res.status(400).json({ error: "Missing orderId" });
      }

      const getOrderByIdService = new GetOrderByIdService();

      const order = await getOrderByIdService.execute({ orderId, userId });

      return res.status(200).send(order);
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

export { GetOrderByIdController };
