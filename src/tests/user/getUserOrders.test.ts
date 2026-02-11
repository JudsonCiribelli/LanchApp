import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

describe("/user/orders", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.$disconnect();
  });

  it("should return a list of orders for the authenticated user", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    await prismaClient.order.create({
      data: {
        type: "PICKUP",
        table: 0,
        status: "PENDING",
        name: "Judson Ciribelli",
        userId: user.id,
      },
    });

    await prismaClient.order.create({
      data: {
        type: "DINE_IN",
        table: 11,
        status: "PENDING",
        name: "Judson Ciribelli",
        userId: user.id,
      },
    });

    const response = await supertest(server)
      .get("/user/orders")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual([
      {
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
      {
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
    ]);
  });

  it("should return an empty list if user has no orders", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/user/orders")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(server).get("/user/orders");
    expect(response.status).toBe(401);
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(server)
      .get("/user/orders")
      .set("Authorization", "Bearer invalid_token_123");

    expect(response.status).toBe(401);
  });

  it("should return 400 if user does not exist (Service Error)", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    await prismaClient.user.delete({
      where: { id: user.id },
    });

    const response = await supertest(server)
      .get("/user/orders")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
