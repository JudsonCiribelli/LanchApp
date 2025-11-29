import type { Request, Response } from "express";
import { UpdateOrderStatusService } from "../../services/order/updateOrderStatusService.ts";
import z from "zod";
import { OrderStatus } from "@prisma/client";

class UpdateOrderStatusController {
  async handle(req: Request, res: Response) {
    const updateOrderStatusSchema = z.object({
      orderId: z.uuid().nonempty({ message: "Order Id is required!" }),
      status: z
        .enum(OrderStatus)
        .refine((val) => Object.values(OrderStatus).includes(val), {
          message:
            "Invalid or missing status. Accepted values: PENDING, IN_PREPARATION, READY, ON_THE_WAY, DELIVERED, CANCELED, FINISHED",
        }),
    });

    try {
      const { status, orderId } = updateOrderStatusSchema.parse(req.body);

      const updateOrderStatusService = new UpdateOrderStatusService();

      const orderStatus = await updateOrderStatusService.execute({
        orderId,
        status,
      });

      return res.status(200).send({ orderStatus });
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

export { UpdateOrderStatusController };
