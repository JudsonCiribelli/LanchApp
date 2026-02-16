import { Readable } from "node:stream";
import cloudinary from "../../config/cloudinary.ts";
import prismaClient from "../../lib/client.ts";
import { cache } from "../../utils/redis.ts";

interface createProductProps {
  name: string;
  categoryId: string;
  price: string;
  banner: string;
  imageBuffer: Buffer;
  description: string;
  userId: string;
}
class CreateProductService {
  async execute({
    name,
    categoryId,
    description,
    price,
    banner,
    userId,
    imageBuffer,
  }: createProductProps) {
    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        role: true,
      },
    });

    if (user?.role !== "ADMIN") {
      throw new Error("Only admins can register new products.");
    }

    const databaseName = name.toLocaleUpperCase();

    const productAlreadyRegister = await prismaClient.product.findFirst({
      where: {
        name: databaseName,
      },
      select: {
        id: true,
      },
    });

    if (productAlreadyRegister) {
      throw new Error("This products is already register on database");
    }

    let bannerUrl = "";

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "tmp",
            resource_type: "image",
            public_id: `${Date.now()}-${banner.split(".")[0]}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        );
        const bufferStream = Readable.from(imageBuffer);
        bufferStream.pipe(uploadStream);
      });

      bannerUrl = result.secure_url;
    } catch (error) {
      console.log(error);
      throw new Error("Error uploading image to Cloudinary");
    }

    const product = await prismaClient.product.create({
      data: {
        name: databaseName,
        categoryId,
        description,
        price,
        banner: bannerUrl,
      },
      select: {
        name: true,
        description: true,
        price: true,
        banner: true,
        id: true,
        category: true,
        categoryId: true,
        createdAt: true,
      },
    });

    await cache.invalidate("all_products");
    return product;
  }
}

export { CreateProductService };
