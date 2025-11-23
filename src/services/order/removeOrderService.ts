import prismaClient from "../../lib/client.ts";

interface RemoveOrderProps {
  orderId: string;
}

class RemoveOrderService {
  async execute({ orderId }: RemoveOrderProps) {
    const orderToDelete = await prismaClient.order.delete({
      where: {
        id: orderId,
      },
    });

    return { orderToDelete };
  }
}

export { RemoveOrderService };
