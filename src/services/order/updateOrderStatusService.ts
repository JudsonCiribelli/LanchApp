import prismaClient from "../../lib/client.ts";

interface UpdateOrderStatus {
  orderId: string;

  userId: string;
}

class UpdateOrderStatusService {
  async execute({ orderId, userId }: UpdateOrderStatus) {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Unauthorized: Only admins can update order status.");
    }

    const orderExists = await prismaClient.order.findUnique({
      where: { id: orderId },
    });

    if (!orderExists) {
      throw new Error("Order not found");
    }

    const order = await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: "FINISHED",
      },
    });

    return order;
  }
}

export { UpdateOrderStatusService };
