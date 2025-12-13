import prismaClient from "../../lib/client.ts";

interface ItemProps {
  orderId: string;
  productId: string;
  amount: number;
  unitPrice: string;
  userId: string;
}

class AddItemService {
  async execute({ orderId, productId, amount, unitPrice, userId }: ItemProps) {
    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.userId !== userId) {
      throw new Error("You do not have permission to modify this order.");
    }

    if (!order.draft) {
      throw new Error(
        "Cannot add items to an order that is already processed."
      );
    }

    const product = await prismaClient.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }
    const item = await prismaClient.item.create({
      data: {
        orderId: orderId,
        productId: productId,
        amount,
        unitPrice: unitPrice,
      },
      include: {
        product: true,
      },
    });

    return item;
  }
}

export { AddItemService };
