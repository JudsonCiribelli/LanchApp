import supertest from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { server } from "../../server.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import prismaClient from "../../lib/client.ts";
import { OrderType } from "@prisma/client";

describe("/DELETE/order", () => {
  afterAll(async () => {
    await prismaClient.order.deleteMany();
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should delete a order", async () => {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    const address = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        city: "Cidade",
        state: "SP",
        zipCode: "12345678",
      },
    });

    const order = await prismaClient.order.create({
      data: {
        name: "Judson",
        table: 10,
        type: OrderType.DINE_IN,
        addressId: address.id,
        userId: user.id,
      },
    });

    const response = await supertest(server)
      .delete("/order")
      .set(`Authorization`, `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      orderToDelete: {
        id: expect.any(String),
        table: expect.any(Number),
        draft: expect.any(Boolean),
        name: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        status: expect.any(String),
        type: expect.any(String),
        addressId: expect.any(String),
        userId: expect.any(String),
      },
    });

    const checkOrder = await prismaClient.order.findUnique({
      where: { id: order.id },
    });

    expect(checkOrder).toBeNull();
  });

  it("should NOT remove an order belonging to another user", async () => {
    const user1 = await makeAuthenticatedUser("ADMIN");

    const orderUser1 = await prismaClient.order.create({
      data: {
        table: 5,
        name: "Pedido da Vítima",
        userId: user1.user.id,
        type: OrderType.DINE_IN,
        status: "FINISHED",
      },
    });

    const user2 = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .delete("/order")
      .query({ orderId: orderUser1.id })
      .set("Authorization", `Bearer ${user2.token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/not found|permission/i);

    const checkOrder = await prismaClient.order.findUnique({
      where: { id: orderUser1.id },
    });

    expect(checkOrder).not.toBeNull();
  });

  it("should NOT remove an order belonging to user that is not ADMIN", async () => {
    const { user, token } = await makeAuthenticatedUser("CLIENT");

    const address = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: "Rua Teste",
        number: "123",
        neighborhood: "Centro",
        city: "Cidade",
        state: "SP",
        zipCode: "12345678",
      },
    });

    const order = await prismaClient.order.create({
      data: {
        name: "Judson",
        table: 10,
        type: OrderType.DINE_IN,
        addressId: address.id,
        userId: user.id,
      },
    });

    const response = await supertest(server)
      .delete("/order")
      .set(`Authorization`, `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(400);
  });

  it("should return 400 if orderId is missing", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .delete("/order")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Order ID is required" });
  });
});
