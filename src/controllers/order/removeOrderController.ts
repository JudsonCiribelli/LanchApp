import type { Response, Request } from "express";
import { RemoveOrderService } from "../../services/order/removeOrderService.ts";

class RemoveOrderController {
  async handle(req: Request, res: Response) {
    const orderId = req.query.orderId as string;

    try {
      const removeOrderService = new RemoveOrderService();

      const orderToDelete = await removeOrderService.execute({ orderId });

      return res.status(200).send({ orderToDelete });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}

export { RemoveOrderController };
