import prismaClient from "../../lib/client.ts";

interface GetItemsProps {
  orderId: string;
}

class GetItemsByOrderIdService {
  async execute({ orderId }: GetItemsProps) {
    const items = await prismaClient.item.findMany({
      where: {
        orderId: orderId,
      },
    });

    return { items };
  }
}

export { GetItemsByOrderIdService };
