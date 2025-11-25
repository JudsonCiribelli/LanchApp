import type { Request, Response } from "express";
import { GetOrderService } from "../../services/order/getOrderService.ts";

class GetOrderController {
  async handle(req: Request, res: Response) {
    try {
      const getOrderService = new GetOrderService();

      const order = await getOrderService.execute();

      return res.status(200).send({ order });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { GetOrderController };
