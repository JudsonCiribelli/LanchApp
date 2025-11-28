import type { Request, Response } from "express";
import { GetOrderService } from "../../services/order/getOrderService.ts";
import z from "zod";

class GetOrderController {
  async handle(req: Request, res: Response) {
    try {
      const getOrderService = new GetOrderService();

      const order = await getOrderService.execute();

      return res.status(200).send({ order });
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

export { GetOrderController };
