import prismaClient from "../../lib/client.ts";

interface RemoveItemProps {
  itemId: string;
  userId: string;
}

class RemoveItemService {
  async execute({ itemId, userId }: RemoveItemProps) {
    const item = await prismaClient.item.findUnique({
      where: {
        id: itemId,
      },
      include: {
        order: true,
      },
    });

    if (!item) {
      throw new Error("Item not found.");
    }

    if (item.order.userId !== userId) {
      throw new Error("You do not have permission to delete this item.");
    }

    const isDraft = item.order.draft;
    const isPending = item.order.status === "PENDING";

    if (!isDraft && !isPending) {
      throw new Error(
        "Cannot remove items from an order that is already being processed."
      );
    }
    const itemToDelete = await prismaClient.item.delete({
      where: {
        id: itemId,
      },
    });

    return itemToDelete;
  }
}

export { RemoveItemService };
