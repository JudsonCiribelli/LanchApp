import type { Request, Response } from "express";
import { GetOrderByIdService } from "../../services/order/getOrderByIdService.ts";

class GetOrderByIdController {
  async handle(req: Request, res: Response) {
    try {
      const orderId = req.query.orderId as string;

      const getOrderByIdService = new GetOrderByIdService();

      const order = await getOrderByIdService.execute({ orderId });

      res.status(200).send(order);

      return res.status(200).send(order);
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { GetOrderByIdController };
