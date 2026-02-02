import prismaClient from "../../lib/client.ts";

interface DeleteProductProps {
  userId: string;
  productId: string;
}

class DeleteProductService {
  async execute({ userId, productId }: DeleteProductProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });
    if (!user) throw new Error("User not found");

    if (user.role !== "ADMIN") {
      throw new Error("Only admins can delete products.");
    }

    const productTodelete = await prismaClient.product.delete({
      where: {
        id: productId,
      },
      select: {
        name: true,
        description: true,
        price: true,
        banner: true,
      },
    });

    return productTodelete;
  }
}

export { DeleteProductService };
