import type { OrderStatus } from "@prisma/client";
import prismaClient from "../../lib/client.ts";

interface UpdateOrderStatus {
  orderId: string;
  status: OrderStatus;
  userId: string;
}

class UpdateOrderStatusService {
  async execute({ status, orderId, userId }: UpdateOrderStatus) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can update order status.");
    }

    const order = await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: status,
      },
    });

    return order;
  }
}

export { UpdateOrderStatusService };
