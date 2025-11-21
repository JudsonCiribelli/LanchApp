/*
  Warnings:

  - You are about to drop the column `cretedAt` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `cretedAt` on the `items` table. All the data in the column will be lost.
  - You are about to drop the column `cretedAt` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `cretedAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `cretedAt` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT');

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "items" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "cretedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT E'CLIENT';
