import { afterAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { OrderType } from "@prisma/client";
import { faker } from "@faker-js/faker";

describe("GET/order/items", () => {
  afterAll(async () => {
    await prismaClient.item.deleteMany();
    await prismaClient.order.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return items by order id", async () => {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    const category = await prismaClient.category.create({
      data: { name: faker.lorem.words(2) },
    });

    const product = await prismaClient.product.create({
      data: {
        name: "Refrigerante",
        price: "5.00",
        description: "Lata",
        banner: "img.png",
        categoryId: category.id,
      },
    });

    const order = await prismaClient.order.create({
      data: {
        table: 2,
        name: "Pedido Pendente 1",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "PENDING",
      },
    });

    const item = await prismaClient.item.create({
      data: {
        amount: 2,
        unitPrice: "5.00",
        orderId: order.id,
        productId: product.id,
      },
    });

    const response = await supertest(server)
      .get("/order/items")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].id).toBe(item.id);
    expect(response.body.items[0].amount).toBe(2);
    expect(response.body.items[0].product.name).toBe("Refrigerante");
  });

  it("should NOT return items if user is CLIENT (Permission Denied)", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const fakeOrderId = "550e8400-e29b-41d4-a716-446655440000";

    const response = await supertest(server)
      .get("/order/items")
      .query({ orderId: fakeOrderId })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "You do not have permission to access this resource.",
    });
  });

  it("should return 400 if orderId is missing", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .get("/order/items")
      .set("Authorization", `Bearer ${token}`)
      .send({ orderId: "" });

    expect(response.status).toBe(400);
  });

  it("should return 400 if orderId is missing or invalid (Zod)", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .get("/order/items")
      .query({ orderId: "invalid-uuid" })
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
  });
});
