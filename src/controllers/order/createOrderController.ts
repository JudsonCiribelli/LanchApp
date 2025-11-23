import type { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/createOrderService.ts";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { table, name, addressId, type } = req.body;
    const userId = req.userId;

    try {
      const createOrderService = new CreateOrderService();

      const order = await createOrderService.execute({
        table,
        name,
        userId,
        addressId,
        type,
      });

      return res.status(201).send({ order });
    } catch (error) {
      console.log(error);
      return res.status(400).send(error);
    }
  }
}

export { CreateOrderController };
