import prismaClient from "../../lib/client.ts";

class GetProductService {
  async execute() {
    const products = await prismaClient.product.findMany({});

    return products;
  }
}
export { GetProductService };
