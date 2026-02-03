import prismaClient from "../../lib/client.ts";

interface GetProductProps {
  categoryId: string;
}

class GetProductByIdService {
  async execute({ categoryId }: GetProductProps) {
    const findByCategoryId = await prismaClient.product.findMany({
      where: {
        categoryId: categoryId,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
        banner: true,
        categoryId: true,
        createdAt: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return findByCategoryId;
  }
}

export { GetProductByIdService };
