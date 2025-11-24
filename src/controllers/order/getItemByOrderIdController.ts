import type { Request, Response } from "express";
import { GetItemsByOrderIdService } from "../../services/order/getItemByOrderIdService.ts";

class GetItemsByOrderIdController {
  async handle(req: Request, res: Response) {
    const { orderId } = req.body;

    try {
      const getItems = new GetItemsByOrderIdService();

      const items = await getItems.execute({ orderId });

      return res.status(200).send({ items });
    } catch (error) {
      console.log(error);

      return res.status(400).send(error);
    }
  }
}
export { GetItemsByOrderIdController };
