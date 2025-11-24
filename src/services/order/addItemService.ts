import prismaClient from "../../lib/client.ts";

interface ItemProps {
  orderId: string;
  productId: string;
  amount: number;
  unitPrice: string;
}

class AddItemService {
  async execute({ orderId, productId, amount, unitPrice }: ItemProps) {
    const item = await prismaClient.item.create({
      data: {
        orderId: orderId,
        productId: productId,
        amount,
        unitPrice: unitPrice,
      },
    });

    return { item };
  }
}

export { AddItemService };
