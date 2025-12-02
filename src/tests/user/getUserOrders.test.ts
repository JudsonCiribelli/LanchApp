import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

describe("/user/orders", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return user orders", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/user/orders")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.body).toEqual({
      userOrders: [],
    });

    expect(response.status).toBe(200);
  });
});
