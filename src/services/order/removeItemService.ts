import prismaClient from "../../lib/client.ts";

interface RemoveItemProps {
  itemId: string;
}

class RemoveItemService {
  async execute({ itemId }: RemoveItemProps) {
    const itemToDelete = await prismaClient.item.delete({
      where: {
        id: itemId,
      },
    });

    return { itemToDelete };
  }
}

export { RemoveItemService };
