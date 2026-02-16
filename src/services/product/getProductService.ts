import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

class GetProductService {
  async execute() {
    const products = await cache.getOrSet("all_products", async () => {
      return await prismaClient.product.findMany({});
    });

    console.log(products);
    return products;
  }
}
export { GetProductService };
