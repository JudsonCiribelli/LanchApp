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

    if (user?.id !== userId) {
      throw new Error("You cannot delete this address!");
    }

    if (!user?.addresses) {
      throw new Error("Register your first address!");
    }

    const deletedAddress = await prismaClient.address.delete({
      where: {
        id: addressId,
      },
    });

    console.log("Deleted Address:", deletedAddress);

    return { deletedAddress };
  }
}

export { DeleteAdressService };
