import prismaClient from "../../lib/client.ts";

interface RemoveOrderProps {
  orderId: string;
  userId: string;
}

class RemoveOrderService {
  async execute({ orderId, userId }: RemoveOrderProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user!.role !== "ADMIN") {
      throw new Error("You do not have permission to delete this order.");
    }

    const order = await prismaClient.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    if (!order) {
      throw new Error("Order not found or you do not have permission.");
    }

    if (order.status !== "PENDING" && order.status !== "FINISHED") {
      throw new Error("Cannot delete a processed order");
    }

    const orderToDelete = await prismaClient.order.delete({
      where: {
        id: orderId,
      },
    });

    return orderToDelete;
  }
}

export { RemoveOrderService };
