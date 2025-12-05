import prismaClient from "../../lib/client.ts";

interface DeleteAdressProps {
  addressId: string;
  userId: string;
}

class DeleteAdressService {
  async execute({ userId, addressId }: DeleteAdressProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
      },
    });

    const address = await prismaClient.address.findFirst({
      where: {
        id: addressId,
        userId: userId,
      },
    });

    if (!address) {
      throw new Error("Address not found or you do not have permission.");
    }

    if (!user?.addresses) {
      throw new Error("Register your first address!");
    }

    const deletedAddress = await prismaClient.address.delete({
      where: {
        id: addressId,
      },
    });

    return deletedAddress;
  }
}

export { DeleteAdressService };
