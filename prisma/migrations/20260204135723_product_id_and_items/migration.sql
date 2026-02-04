/*
  Warnings:

  - You are about to drop the `_ItemToProduct` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productId` to the `items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ItemToProduct" DROP CONSTRAINT "_ItemToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemToProduct" DROP CONSTRAINT "_ItemToProduct_B_fkey";

-- AlterTable
ALTER TABLE "items" ADD COLUMN "productId" TEXT;

-- DropTable
DROP TABLE "_ItemToProduct";

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
