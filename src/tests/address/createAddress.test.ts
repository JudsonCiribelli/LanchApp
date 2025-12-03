import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import prismaClient from "../../lib/client.ts";
import { faker } from "@faker-js/faker";

describe("/user/address", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should create a new user address", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const validZipCode = "12345-678";

    const response = await supertest(server)
      .post("/user/address")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: faker.lorem.paragraph(2),
        number: faker.lorem.lines(1),
        complement: faker.lorem.paragraph(1),
        neighborhood: faker.lorem.lines(1),
        city: faker.lorem.text(),
        state: faker.lorem.text(),
        zipCode: validZipCode,
      });

    expect(response.body).toHaveProperty("address");
    expect(response.body.address).toHaveProperty("id");
    expect(response.body.address.zipCode).toBe("12345678");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      address: {
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
    });
  });

  it("should NOT create address with invalid ZipCode length", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: faker.location.street(),
        number: "10",
        complement: "Casa",
        neighborhood: "Bairro",
        city: "Cidade Teste",
        state: "SP",
        zipCode: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(JSON.stringify(response.body.issues)).toContain(
      "ZIP CODE INVALID. It must contain 8 digits"
    );
  });

  it("should NOT create address with empty required fields", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .post("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "",
        number: "10",
        complement: "",
        neighborhood: "",
        city: "Cidade",
        state: "UF",
        zipCode: "12345678",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");

    const issues = JSON.stringify(response.body.issues);
    expect(issues).toContain("Street field is required!");
    expect(issues).toContain("Complement field is required!");
    expect(issues).toContain("Neighborhood field is required!");
  });

  it("should return 401 if token is missing or invalid", async () => {
    const response = await supertest(server).post("/user/address").send({
      street: "Rua Teste",
    });

    expect(response.status).toBe(401);
  });
});
