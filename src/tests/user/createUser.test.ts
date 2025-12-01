import { afterAll, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { server } from "../../server.ts";
import { faker } from "@faker-js/faker";
import prismaClient from "../../lib/client.ts";

const generateValidPhone = () => {
  const ddd = faker.number.int({ min: 11, max: 99 }).toString();
  const part2 = faker.number.int({ min: 10000000, max: 99999999 }).toString();
  return `${ddd}9${part2}`;
};

describe("/user, Create User Controller", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("Should create a new user successfully", async () => {
    const response = await supertest(server).post("/user").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "password123",
      phone: generateValidPhone(),
    });

    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toEqual({
      user: {
        name: expect.any(String),
        email: expect.any(String),
        phone: expect.any(String),
      },
    });
    expect(response.body.user).not.toHaveProperty("password");
  });

  it("Should NOT create a user with short password (Zod Validation)", async () => {
    const response = await supertest(server)
      .post("/user")
      .set("Content-Type", "application/json")
      .send({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: "12345",
        phone: generateValidPhone(),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(JSON.stringify(response.body.issues)).toContain(
      "The password must be at least 8 characters long"
    );
  });

  it("Should NOT create a user with invalid phone format", async () => {
    const response = await supertest(server).post("/user").send({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "validpassword123",
      phone: "119999",
    });

    expect(response.status).toBe(400);
    expect(JSON.stringify(response.body.issues)).toEqual(
      expect.stringContaining(
        "The phone number must have 11 digits (DDD + 9xxxx-xxxx)."
      )
    );
  });

  it("Should NOT create a user with duplicate email", async () => {
    const email = faker.internet.email();
    const phone1 = generateValidPhone();

    await supertest(server).post("/user").send({
      name: "User One",
      email: email,
      password: "password123",
      phone: phone1,
    });

    const response = await supertest(server).post("/user").send({
      name: "User Two",
      email: email,
      password: "password123",
      phone: generateValidPhone(),
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "This email is already register",
    });
  });

  it("Should NOT create a user with duplicate phone number", async () => {
    const email1 = faker.internet.email();
    const email2 = faker.internet.email();
    const phone1 = generateValidPhone();

    await supertest(server).post("/user").send({
      name: "User One",
      email: email1,
      password: "password123",
      phone: phone1,
    });

    const response = await supertest(server).post("/user").send({
      name: "User Two",
      email: email2,
      password: "password123",
      phone: phone1,
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: "This phone is already register",
    });
  });
});
