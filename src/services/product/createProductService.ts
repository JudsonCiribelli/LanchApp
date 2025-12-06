import prismaClient from "../../lib/client.ts";

interface createProductProps {
  name: string;
  categoryId: string;
  price: string;
  banner: string;
  description: string;
  userId: string;
}
class CreateProductService {
  async execute({
    name,
    categoryId,
    description,
    price,
    banner,
    userId,
  }: createProductProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (user?.role !== "ADMIN") {
      throw new Error("Only admins can register new products.");
    }

    const databaseName = name.toLocaleUpperCase();

    const productAlreadyRegister = await prismaClient.product.findFirst({
      where: {
        name: databaseName,
      },
      select: {
        id: true,
      },
    });

    if (productAlreadyRegister) {
      throw new Error("This products is already register on database");
    }

    const product = await prismaClient.product.create({
      data: {
        name: databaseName,
        categoryId,
        description,
        price,
        banner,
      },
    });

    return product;
  }
}

export { CreateProductService };
