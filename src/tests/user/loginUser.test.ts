import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { makeUser } from "../factories/user/makeUser.ts";

describe("/session", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should login user session", async () => {
    const { user, plainPassword } = await makeUser();

    const response = await supertest(server)
      .post("/session")
      .set("Content-Type", "application/json")
      .send({
        email: user.email,
        password: plainPassword,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      login: {
        token: expect.any(String),
      },
    });
  });

  it("should not login with incorrect password", async () => {
    const user = await makeUser();

    const response = await supertest(server).post("/session").send({
      email: user.user.email,
      password: "12345678",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.stringMatching(/password|credentials/i),
      })
    );
  });

  it("should not login with non-existent email", async () => {
    const response = await supertest(server).post("/session").send({
      email: "ghost@email.com",
      password: "anyPassword123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("should return error if password to short", async () => {
    const user = await makeUser();

    const response = await supertest(server).post("/session").send({
      email: user.user.email,
      password: "1234",
    });

    expect(response.status).toBe(400);
  });
});
