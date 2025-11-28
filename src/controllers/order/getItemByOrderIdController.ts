import type { Request, Response } from "express";
import { GetItemsByOrderIdService } from "../../services/order/getItemByOrderIdService.ts";
import z from "zod";

class GetItemsByOrderIdController {
  async handle(req: Request, res: Response) {
    const getItemsByOrderIdSchema = z.object({
      orderId: z.uuid().nonempty({ message: "Order id is required!" }),
    });

    try {
      const { orderId } = getItemsByOrderIdSchema.parse(req.body);

      const getItems = new GetItemsByOrderIdService();

      const items = await getItems.execute({ orderId });

      return res.status(200).send({ items });
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
export { GetItemsByOrderIdController };
