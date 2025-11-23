import prismaClient from "../../lib/client.ts";

interface GetUserOdersProps {
  userId: string;
}

class GetUserOrdersService {
  async execute({ userId }: GetUserOdersProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        orders: true,
      },
    });

    return user?.orders;
  }
}
export { GetUserOrdersService };
