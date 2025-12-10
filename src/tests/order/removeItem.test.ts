import { afterAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import prismaClient from "../../lib/client.ts";
import { OrderType } from "@prisma/client";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("DELETE/order/items", () => {
  afterAll(async () => {
    await prismaClient.item.deleteMany();
    await prismaClient.order.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  async function createScenario(
    status: "PENDING" | "IN_PREPARATION" = "PENDING",
    isDraft: boolean = true
  ) {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const category = await prismaClient.category.create({
      data: { name: "Geral" },
    });
    const product = await prismaClient.product.create({
      data: {
        name: "Suco",
        price: "5",
        description: "Suco",
        banner: "img",
        categoryId: category.id,
      },
    });

    const order = await prismaClient.order.create({
      data: {
        table: 1,
        name: "Mesa 1",
        userId: user.id,
        status: status,
        type: OrderType.DINE_IN,
        draft: isDraft,
      },
    });

    const item = await prismaClient.item.create({
      data: {
        amount: 1,
        unitPrice: "5,00",
        orderId: order.id,
        productId: product.id,
      },
    });

    return { token, user, item, order };
  }

  it("should remove an item from a DRAFT order (Cart mode)", async () => {
    const { token, item } = await createScenario("PENDING", true);

    const response = await supertest(server)
      .delete("/order/items")
      .query({ itemId: item.id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.itemToDelete.id).toBe(item.id);
  });

  it("should remove an item from a CONFIRMED but PENDING order", async () => {
    const { token, item } = await createScenario("PENDING", false);

    const response = await supertest(server)
      .delete("/order/items")
      .query({ itemId: item.id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
  it("should NOT remove an item if order is IN_PREPARATION (Draft false)", async () => {
    const { token, item } = await createScenario("IN_PREPARATION", false);

    const response = await supertest(server)
      .delete("/order/items")
      .query({ itemId: item.id })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("already being processed");

    const checkDb = await prismaClient.item.findUnique({
      where: { id: item.id },
    });
    expect(checkDb).not.toBeNull();
  });
});
