import type { Request, Response } from "express";
import { UpdateOrderStatusService } from "../../services/order/updateOrderStatusService.ts";

class UpdateOrderStatusController {
  async handle(req: Request, res: Response) {
    const { status, orderId } = req.body;

    try {
      const updateOrderStatusService = new UpdateOrderStatusService();

      const orderStatus = await updateOrderStatusService.execute({
        orderId,
        status,
      });

      return res.status(200).send({ orderStatus });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { UpdateOrderStatusController };
