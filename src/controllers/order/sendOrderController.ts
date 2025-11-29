import type { Request, Response } from "express";
import { SendOrderService } from "../../services/order/sendOrderService.ts";
import z from "zod";
class SendOrderController {
  async handle(req: Request, res: Response) {
    const sendOrderSchema = z.object({
      orderId: z.uuid().nonempty({ message: "Order Id is required!" }),
    });

    try {
      const { orderId } = sendOrderSchema.parse(req.body);

      const sendOrderService = new SendOrderService();

      const order = await sendOrderService.execute({ orderId });

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

export { SendOrderController };
