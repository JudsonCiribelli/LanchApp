import { afterAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { OrderType } from "@prisma/client";

describe("PUT/order/send", () => {
  afterAll(async () => {
    await prismaClient.order.deleteMany();
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should send an order", async () => {
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
        type: OrderType.DELIVERY,
        addressId: address.id,
      },
    });

    const response = await supertest(server)
      .put("/order/send")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(200);
  });

  it("should send an order with orderId invalid", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .put("/order/send")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: "5555-555555-55555555-5555555" });
    expect(response.status).toBe(400);
  });

  it("should return 401 if token invalid", async () => {
    const { user } = await makeAuthenticatedUser("CLIENT");

    const token = "555555555";

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
        type: OrderType.DELIVERY,
        addressId: address.id,
      },
    });

    const response = await supertest(server)
      .put("/order/send")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(401);
  });
});
