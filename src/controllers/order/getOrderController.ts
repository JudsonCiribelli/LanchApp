import type { Request, Response } from "express";
import { GetOrderService } from "../../services/order/getOrderService.ts";

class GetOrderController {
  async handle(req: Request, res: Response) {
    try {
      const getOrderService = new GetOrderService();

      const result = await getOrderService.execute();

      return res.status(200).send({ result });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }

      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

export { GetOrderController };
