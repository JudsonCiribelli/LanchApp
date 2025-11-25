import prismaClient from "../../lib/client.ts";

class GetOrderService {
  async execute() {
    const order = await prismaClient.order.findMany({
      where: {
        status: "PENDING",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return { order };
  }
}

export { GetOrderService };
