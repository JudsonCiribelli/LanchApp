import prismaClient from "../../lib/client.ts";

interface sendOrderProps {
  orderId: string;
}

class SendOrderService {
  async execute({ orderId }: sendOrderProps) {
    const order = await prismaClient.order.update({
      where: {
        id: orderId,
      },
      data: {
        draft: false,
      },
    });

    return { order };
  }
}

export { SendOrderService };
