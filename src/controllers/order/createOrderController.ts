import type { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/createOrderService.ts";
import z from "zod";
import { OrderType } from "@prisma/client";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    const userId = req.userId;

    const createOrderSchema = z.object({
      table: z.number().min(1),
      name: z.string().nonempty({ message: "Your name is required!" }),
      addressId: z.uuid(),
      type: z
        .enum(OrderType)
        .refine((val) => Object.values(OrderType).includes(val), {
          message:
            "Invalid or missing status. Accepted values: PENDING, IN_PREPARATION, READY, ON_THE_WAY, DELIVERED, CANCELED, FINISHED",
        }),
    });

    try {
      const { table, name, addressId, type } = createOrderSchema.parse(
        req.body
      );

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

export { CreateOrderController };
