import prismaClient from "../../lib/client.ts";

interface GetOrderProps {
  orderId: string;
  userId: string;
}

class GetOrderByIdService {
  async execute({ userId, orderId }: GetOrderProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.role !== "ADMIN") {
      throw new Error("You do not have permission to access this resource.");
    }

    if (!orderId) {
      throw new Error("Order id is required.");
    }

    const order = await prismaClient.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }
}

export { GetOrderByIdService };
