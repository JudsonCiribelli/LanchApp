import prismaClient from "../../lib/client.ts";

interface UpdateAddressProps {
  userId: string;
  addressId: string;
  newStreet: string;
  newNumber: string;
  newComplement: string;
  newNeighborhood: string;
  newCity: string;
  newState: string;
  newZipCode: string;
}

class UpdateAddressService {
  async execute({
    userId,
    addressId,
    newStreet,
    newNumber,
    newComplement,
    newNeighborhood,
    newCity,
    newState,
    newZipCode,
  }: UpdateAddressProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (user.addresses.length === 0) {
      throw new Error("Register your first address!");
    }

    const address = await prismaClient.address.findUnique({
      where: {
        id: addressId,
      },
      include: {
        user: true,
      },
    });

    if (!address) {
      throw new Error("Address not found");
    }

    if (address.user.id !== userId) {
      throw new Error("You do not have permission to update this address");
    }

    const updatedAddress = await prismaClient.address.update({
      where: {
        id: addressId,
      },
      data: {
        street: newStreet,
        number: newNumber,
        complement: newComplement,
        neighborhood: newNeighborhood,
        city: newCity,
        state: newState,
        zipCode: newZipCode,
      },
    });

    return updatedAddress;
  }
}

export { UpdateAddressService };
