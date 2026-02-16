import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

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

    const categories = await cache.getOrSet("all_categories", async () => {
      return await prismaClient.category.findMany({
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          products: true,
        },
      });
    });
    console.log(categories);
    // const category = await prismaClient.category.findMany({
    //   select: {
    //     id: true,
    //     name: true,
    //     createdAt: true,
    //     products: true,
    //   },
    // });

    return categories;
  }
}

export { GetCategoryService };
