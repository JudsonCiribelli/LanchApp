import prismaClient from "../../lib/client.ts";

interface GetCategoryProps {
  userId: string;
}

class GetCategoryService {
  async execute({ userId }: GetCategoryProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found!");
    }

    if (user.role !== "ADMIN") {
      throw new Error("Only admins can register categories.");
    }

    const category = await prismaClient.category.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        products: true,
      },
    });

    return category;
  }
}

export { GetCategoryService };
