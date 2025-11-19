/*
  Warnings:

  - You are about to drop the column `buyerId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_buyerId_fkey";

-- AlterTable
ALTER TABLE "items" ADD COLUMN     "unitPrice" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "buyerId",
ADD COLUMN     "addressId" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
