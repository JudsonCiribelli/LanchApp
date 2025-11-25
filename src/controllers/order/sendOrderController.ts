import type { Request, Response } from "express";
import { SendOrderService } from "../../services/order/sendOrderService.ts";
class SendOrderController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.body;

    try {
      const sendOrderService = new SendOrderService();

      const order = await sendOrderService.execute({ orderId });

      return res.status(200).send({ order });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { SendOrderController };
