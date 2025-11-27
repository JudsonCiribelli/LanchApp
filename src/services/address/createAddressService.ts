import prismaClient from "../../lib/client.ts";

interface CreateAddressesProps {
  userId: string;
  street: string;
  number: number;
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
    const newNumber = String(number);

    const addresses = await prismaClient.address.create({
      data: {
        userId,
        street,
        number: newNumber,
        complement,
        neighborhood,
        city,
        state,
        zipCode,
      },
    });

    return { addresses };
  }
}

export { CreateAddressesService };
