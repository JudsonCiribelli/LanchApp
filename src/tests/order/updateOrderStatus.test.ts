import { afterAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import { OrderStatus, OrderType } from "@prisma/client";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("PUT/order/update", () => {
  afterAll(async () => {
    await prismaClient.order.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  async function createOrder() {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    const order = await prismaClient.order.create({
      data: {
        table: 10,
        name: "Mesa Teste",
        userId: user.id,
        status: OrderStatus.PENDING,
        type: OrderType.DINE_IN,
        draft: false,
      },
    });

    return { token, order, user };
  }

  it("should update order status", async () => {
    const { token, order } = await createOrder();

    const response = await supertest(server)
      .put("/order/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: order.id,
        status: "IN_PREPARATION",
      });

    expect(response.status).toBe(200);
    expect(response.body.orderStatus.status).toBe("FINISHED");
    expect(response.body).toEqual({
      orderStatus: {
        id: expect.any(String),
        table: expect.any(Number),
        draft: expect.any(Boolean),
        name: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        status: expect.any(String),
        type: expect.any(String),
        addressId: null,
        userId: expect.any(String),
      },
    });

    const dbOrder = await prismaClient.order.findUnique({
      where: { id: order.id },
    });

    expect(dbOrder?.status).toBe("FINISHED");
  });

  it("should NOT allow a CLIENT to update order status", async () => {
    const { order } = await createOrder();

    const client = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .put("/order/update")
      .set("Authorization", `Bearer ${client.token}`)
      .send({
        orderId: order.id,
        status: "FINISHED",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/Unauthorized|Only admins/i);

    const dbOrder = await prismaClient.order.findUnique({
      where: { id: order.id },
    });

    expect(dbOrder?.status).toBe("PENDING");
  });

  it("should return 400 (or 500) if orderId does not exist", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .put("/order/status")
      .set("Authorization", `Bearer ${token}`)
      .send({
        orderId: "xxxxxxxxxxxxxxxxxxxx",
        status: "FINISHED",
      });

    expect(response.status).toBe(404);
  });
});
