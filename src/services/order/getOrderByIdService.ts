import prismaClient from "../../lib/client.ts";

interface GetOrderProps {
  orderId: string;
}

class GetOrderByIdService {
  async execute({ orderId }: GetOrderProps) {
    const order = await prismaClient.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return order;
  }
}

export { GetOrderByIdService };
