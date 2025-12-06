import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";

describe("GET/user/address", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should return user addresses", async () => {
    const { user, token } = await makeAuthenticatedUser("CLIENT");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const addressUser = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: "Rua Protegida",
        number: "100",
        neighborhood: "Centro",
        city: "São Paulo",
        complement: "Quadra 120",
        state: "SP",
        zipCode: "12345678",
      },
    });

    const response = await supertest(server)
      .get("/user/address")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userAddresses");
    expect(Array.isArray(response.body.userAddresses)).toBe(true);
    expect(response.body).toEqual({
      userAddresses: [
        {
          id: expect.any(String),
          street: expect.any(String),
          number: expect.any(String),
          complement: expect.any(String),
          neighborhood: expect.any(String),
          city: expect.any(String),
          state: expect.any(String),
          zipCode: expect.any(String),
          userId: expect.any(String),
        },
      ],
    });
  });

  it("should return an empty list if user has no addresses register", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .get("/user/address")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("userAddresses");
    expect(response.body.userAddresses).toEqual([]);
  });

  it("should return 401 if no token is provided", async () => {
    const response = await supertest(server).get("/user/address");
    expect(response.status).toBe(401);
  });

  it("should return 401 if token is invalid", async () => {
    const response = await supertest(server)
      .get("/user/address")
      .set("Authorization", "Bearer token_falso_123");

    expect(response.status).toBe(401);
  });

  it("should return 400 if user does not exist (Service Error)", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    await prismaClient.user.delete({
      where: { id: user.id },
    });

    const response = await supertest(server)
      .get("/user/address")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "User not found" });
  });
});
