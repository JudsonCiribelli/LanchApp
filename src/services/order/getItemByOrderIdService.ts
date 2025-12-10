import prismaClient from "../../lib/client.ts";

interface GetItemsProps {
  orderId: string;
  userId: string;
}

class GetItemsByOrderIdService {
  async execute({ orderId, userId }: GetItemsProps) {
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

    const items = await prismaClient.item.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        product: true,
      },
    });

    return items;
  }
}

export { GetItemsByOrderIdService };
