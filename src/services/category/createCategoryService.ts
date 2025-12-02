import prismaClient from "../../lib/client.ts";

interface CreateCategoryProps {
  userId: string;
  categoryName: string;
}

class CreateCategoryService {
  async execute({ userId, categoryName }: CreateCategoryProps) {
    const databaseName = categoryName.toLocaleUpperCase().trim();

    if (!databaseName) {
      throw new Error("Category name is required!");
    }

    const [user, categoryNameAlreadyExist, category] = await Promise.all([
      await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
      }),

      await prismaClient.category.findFirst({
        where: {
          name: databaseName,
        },
      }),

      await prismaClient.category.create({
        data: {
          name: databaseName,
        },
      }),
    ]);

    if (user?.role !== "ADMIN") {
      throw new Error("Only admins can register categories.");
    }

    if (categoryNameAlreadyExist) {
      throw new Error("This category is already exist");
    }

    return category;
  }
}
export { CreateCategoryService };
