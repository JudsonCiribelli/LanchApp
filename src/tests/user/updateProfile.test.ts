import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { server } from "../../server.ts";
import request from "supertest";
import { faker } from "@faker-js/faker";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";

const generateValidPhone = () => {
  const ddd = faker.number.int({ min: 11, max: 99 }).toString();
  const part2 = faker.number.int({ min: 10000000, max: 99999999 }).toString();
  return `${ddd}9${part2}`;
};

describe("PUT/user", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should update user profile", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const response = await supertest(server)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        newName: faker.person.fullName(),
        newEmail: faker.internet.email(),
        newPhone: generateValidPhone(),
      });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      password: expect.any(String),
      phone: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      role: expect.any(String),
    });
  });

  it("should return 401 if token is missing", async () => {
    const response = await supertest(server).put("/user/profile").send({
      newName: faker.person.fullName(),
      newEmail: faker.internet.email(),
      newPhone: generateValidPhone(),
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Auth token is required");
  });

  it("should return 401 if token is invalid ", async () => {
    const invalidToken = "invalid_token_123";

    const response = await supertest(server)
      .put("/user/profile")
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        newName: faker.person.fullName(),
        newEmail: faker.internet.email(),
        newPhone: generateValidPhone(),
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Authorization error!");
  });

  it("should return 400 if updates fails (Business Logic Error)", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");
    const user1 = await makeAuthenticatedUser("CLIENT");
    const emailToConflict = user1.user.email;

    const response = await request(server)
      .put("/user/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        newName: "Tentativa de Falha",
        newEmail: emailToConflict,
        newPhone: "00000000",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
