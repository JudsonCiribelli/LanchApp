import { afterAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { OrderType } from "@prisma/client";

describe("GET/order/id", () => {
  afterAll(async () => {
    await prismaClient.item.deleteMany();
    await prismaClient.order.deleteMany();
    await prismaClient.product.deleteMany();
    await prismaClient.category.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return order by id", async () => {
    const { token, user } = await makeAuthenticatedUser("ADMIN");

    const order = await prismaClient.order.create({
      data: {
        table: 2,
        name: "Pedido Pendente 1",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "PENDING",
      },
    });

    const response = await supertest(server)
      .get("/order/id")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
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
      items: expect.any(Array),
    });
  });

  it("should return 400 if orderId is missing", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .get("/order/id")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe("Missing orderId");
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(server).get("/order/id");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Auth token is required");
  });

  it("should NOT return order if user is CLIENT (Permission Denied)", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const order = await prismaClient.order.create({
      data: {
        table: 2,
        name: "Pedido Pendente 1",
        userId: user.id,
        type: OrderType.DINE_IN,
        status: "PENDING",
      },
    });

    const response = await supertest(server)
      .get("/order/id")
      .set("Authorization", `Bearer ${token}`)
      .query({ orderId: order.id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
    expect(response.body.error).toBe(
      "You do not have permission to access this resource.",
    );
  });
});
