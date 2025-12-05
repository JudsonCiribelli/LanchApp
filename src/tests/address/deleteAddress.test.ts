import { afterAll, beforeAll, describe, expect, it } from "vitest";
import prismaClient from "../../lib/client.ts";
import { makeAuthenticatedUser } from "../factories/user/makeAuthenticatedUser.ts";
import supertest from "supertest";
import { server } from "../../server.ts";
import { faker } from "@faker-js/faker";

describe("/user/address", () => {
  beforeAll(async () => {});

  afterAll(async () => {
    await prismaClient.address.deleteMany();
    await prismaClient.user.deleteMany();
    await prismaClient.$disconnect();
  });

  it("should delete user address", async () => {
    const { token, user } = await makeAuthenticatedUser("CLIENT");

    const validZipCode = "12345-678";

    const fakeAddress = await prismaClient.address.create({
      data: {
        userId: user.id,
        street: faker.lorem.paragraph(2),
        number: faker.lorem.lines(1),
        complement: faker.lorem.paragraph(1),
        neighborhood: faker.lorem.lines(1),
        city: faker.lorem.text(),
        state: faker.lorem.text(),
        zipCode: validZipCode,
      },
    });

    const response = await supertest(server)
      .delete("/user/address")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        addressId: fakeAddress.id,
      });

    expect(response.status).toBe(200);
    expect(response.body.addressToDelete).toHaveProperty("id", fakeAddress.id);
    expect(response.body).toEqual({
      addressToDelete: {
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

    const checkAddress = await prismaClient.address.findUnique({
      where: { id: fakeAddress.id },
    });

    expect(checkAddress).toBeNull();
  });

  it("should NOT delete address with invalid UUID format", async () => {
    const { token } = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .delete("/user/address")
      .set("Authorization", `Bearer ${token}`)
      .send({
        addressId: "123-this-is-not-valid-uuid",
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
  });

  it("should NOT delete an address that belongs to another user", async () => {
    const user1 = await makeAuthenticatedUser("CLIENT");

    const addressUser1 = await prismaClient.address.create({
      data: {
        userId: user1.user.id,
        street: "Rua Protegida",
        number: "100",
        neighborhood: "Centro",
        city: "São Paulo",
        state: "SP",
        zipCode: "12345678",
      },
    });

    const user2 = await makeAuthenticatedUser("CLIENT");

    const response = await supertest(server)
      .delete("/user/address")
      .set("Authorization", `Bearer ${user2.token}`)
      .send({
        addressId: addressUser1.id,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.stringMatching(/not found|permission/i),
      })
    );

    const checkAddressInDb = await prismaClient.address.findUnique({
      where: { id: addressUser1.id },
    });

    expect(checkAddressInDb).toBeTruthy();
    expect(checkAddressInDb?.id).toBe(addressUser1.id);
  });
});
