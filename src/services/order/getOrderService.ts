import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

class GetOrderService {
  async execute() {
    const result = await cache.getOrSet("orders_pending", async () => {
      return prismaClient.order.findMany({
        where: {
          status: "PENDING",
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  price: true,
                  banner: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    });

    return result;
  }
}

export { GetOrderService };
