import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

interface GetUserProps {
  userId: string;
}

class GetUserService {
  async execute({ userId }: GetUserProps) {
    if (!userId) {
      throw new Error("User id is required!");
    }

    const user = await cache.getOrSet("user", async () => {
      return await prismaClient.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          addresses: true,
          orders: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
export { GetUserService };
