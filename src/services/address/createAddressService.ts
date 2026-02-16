import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

interface CreateAddressesProps {
  userId: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

class CreateAddressesService {
  async execute({
    userId,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
    zipCode,
  }: CreateAddressesProps) {
    const address = await prismaClient.address.create({
      data: {
        userId,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      },
    });

    await cache.invalidate("user_address");
    return address;
  }
}

export { CreateAddressesService };
