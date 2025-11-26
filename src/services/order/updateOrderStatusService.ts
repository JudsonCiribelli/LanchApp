import type { OrderStatus } from "@prisma/client";
import prismaClient from "../../lib/client.ts";

interface UpdateOrderStatus {
  orderId: string;
  status: OrderStatus;
}

class UpdateOrderStatusService {
  async execute({ status, orderId }: UpdateOrderStatus) {
    const order = await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });

    return { order };
  }
}

export { UpdateOrderStatusService };
