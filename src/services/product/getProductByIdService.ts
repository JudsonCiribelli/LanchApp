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
    });

    return findByCategoryId;
  }
}

export { GetProductByIdService };
