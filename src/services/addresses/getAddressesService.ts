import prismaClient from "../../lib/client.ts";

interface GetAddressesProps {
  userId: string;
}

class GetAddressesService {
  async execute({ userId }: GetAddressesProps) {
    const userAddress = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        addresses: true,
      },
    });

    return userAddress?.addresses;
  }
}

export { GetAddressesService };
