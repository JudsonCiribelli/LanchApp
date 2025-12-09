import type { OrderType } from "@prisma/client";
import prismaClient from "../../lib/client.ts";

interface createOrderProps {
  table: number;
  name: string;
  userId: string;
  addressId?: string | undefined;
  type: OrderType;
}

class CreateOrderService {
  async execute({ table, name, userId, addressId, type }: createOrderProps) {
    if (type === "DINE_IN") {
      if (!table) {
        throw new Error("To dine in, a table number is required.");
      }
      addressId = undefined;
    }

    if (type === "DELIVERY") {
      table = 0;

      if (!addressId) {
        const user = await prismaClient.user.findUnique({
          where: {
            id: userId,
          },
          include: {
            addresses: true,
          },
        });

        if (!user || user.addresses.length === 0) {
          throw new Error(
            "Delivery is not possible without a registered address"
          );
        }

        if (user.addresses.length === 1) {
          addressId = user.addresses[0]!.id;
        } else {
          throw new Error("Choose a delivery address.");
        }
      }
    }

    if (type === "PICKUP") {
      table = 0;
      addressId = undefined;
    }

    const order = await prismaClient.order.create({
      data: {
        table: table,
        name: name,
        userId: userId,
        addressId: addressId || null,
        type: type,
        status: "PENDING",
        draft: true,
      },
    });

    return order;
  }
}

export { CreateOrderService };
