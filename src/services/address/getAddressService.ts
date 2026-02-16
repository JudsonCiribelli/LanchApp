import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

interface GetAddressesProps {
  userId: string;
}

class GetAddressService {
  async execute({ userId }: GetAddressesProps) {
    const userAddress = await cache.getOrSet("user_address", async () => {
      return prismaClient.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          addresses: true,
        },
      });
    });

    if (!userAddress) {
      throw new Error("User not found");
    }

    return userAddress?.addresses;
  }
}

export { GetAddressService };
