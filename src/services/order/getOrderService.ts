import prismaClient from "../../lib/client.ts";

class GetOrderService {
  async execute() {
    const result = await prismaClient.order.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return result;
  }
}

export { GetOrderService };
