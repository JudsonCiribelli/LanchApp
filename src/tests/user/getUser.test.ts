import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

describe("GET /user", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return user data", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/user")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      user: {
        name: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    });
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(server).get("/user");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Auth token is required" });
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(server)
      .get("/user")
      .set("Authorization", "Bearer token_invalido_123");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Authorization error!" });
  });

  it("should return 400 if user is not found (Business Error)", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    await prismaClient.user.delete({
      where: { id: user.id },
    });

    const response = await supertest(server)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
