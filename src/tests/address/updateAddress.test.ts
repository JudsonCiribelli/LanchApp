import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { faker } from "@faker-js/faker";

describe("PUT/user/address", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should update an existing user address successfully", async () => {
    const { token } = await makeAuthenticatedUser("ADMIN");

    const validZipCode = "12345-678";

    const addressResponse = await supertest(server)
      .post("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        id: faker.string.uuid(),
        street: faker.location.street(),
        number: faker.lorem.words(3),
        complement: faker.lorem.words(6),
        neighborhood: faker.lorem.paragraph(2),
        city: faker.lorem.paragraph(3),
        state: faker.lorem.paragraph(1),
        zipCode: "99999-999",
      });

    const response = await supertest(server)
      .put("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        addressId: addressResponse.body.id,
        newStreet: "Rua atualizada",
        newNumber: "200",
        newComplement: "Cidade Nova",
        newNeighborhood: "Bairro Novo",
        newCity: "Cidade Nova",
        newState: "RJ",
        newZipCode: validZipCode,
      });

    expect(response.status).toBe(202);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toEqual({
      id: expect.any(String),
      street: expect.any(String),
      number: expect.any(String),
      complement: expect.any(String),
      neighborhood: expect.any(String),
      city: expect.any(String),
      state: expect.any(String),
      zipCode: expect.any(String),
      userId: expect.any(String),
    });
    const dbAddress = await prismaClient.address.findUnique({
      where: { id: addressResponse.body.id },
    });
    expect(dbAddress?.street).toBe("Rua atualizada");
  });

  it("should NOT update address if it belongs to another user", async () => {
    const userA = await makeAuthenticatedUser("CLIENT");

    const createResponseA = await supertest(server)
      .post("/user/address")
      .set("Authorization", `Bearer ${userA.token}`)
      .send({
        street: "Rua do User A",
        number: "10",
        complement: "Casa",
        neighborhood: "Bairro A",
        city: "Cidade A",
        state: "AA",
        zipCode: "11111-111",
      });
    const addressIdUserA = createResponseA.body.id;

    const userB = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .put("/user/address")
      .set("Authorization", `Bearer ${userB.token}`)
      .send({
        addressId: addressIdUserA,
        newStreet: "Rua Hackeada",
        newNumber: "666",
        newComplement: "Hack",
        newNeighborhood: "Hack",
        newCity: "Hack",
        newState: "HK",
        newZipCode: "00000-000",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch("Register your first address!");
  });

  it("should NOT update with invalid ZipCode length", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .put("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        addressId: "some-uuid",
        newStreet: faker.location.street(),
        newNumber: "10",
        newComplement: "Casa",
        newNeighborhood: "Bairro",
        newCity: "Cidade",
        newState: "SP",
        newZipCode: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(JSON.stringify(response.body.issues)).toContain(
      "ZIP CODE INVALID. It must contain 8 digits",
    );
  });

  it("should NOT update if addressId is missing", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .put("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        newStreet: "Rua Teste",
        newNumber: "10",
        newComplement: "C",
        newNeighborhood: "B",
        newCity: "C",
        newState: "S",
        newZipCode: "12345-678",
      });

    expect(response.status).toBe(400);
    expect(JSON.stringify(response.body.issues)).toContain(
      "expected string, received undefined",
    );
  });

  it("should return 400 if Address not found", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    await supertest(server)
      .post("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        street: "Endereço Real",
        number: "1",
        complement: "C",
        neighborhood: "N",
        city: "C",
        state: "S",
        zipCode: "12345-678",
      });

    const fakeId = "550e8400-e29b-41d4-a716-446655440000";

    const response = await supertest(server)
      .put("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        addressId: fakeId,
        newStreet: "Rua Teste",
        newNumber: "10",
        newComplement: "C",
        newNeighborhood: "B",
        newCity: "C",
        newState: "S",
        newZipCode: "12345-678",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Address not found");
  });
});
