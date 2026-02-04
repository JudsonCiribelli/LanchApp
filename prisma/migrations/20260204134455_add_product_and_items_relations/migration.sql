/*
  Warnings:

  - You are about to drop the column `productId` on the `items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_productId_fkey";

-- AlterTable
ALTER TABLE "items" DROP COLUMN "productId";

-- CreateTable
CREATE TABLE "_ItemToProduct" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemToProduct_AB_unique" ON "_ItemToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemToProduct_B_index" ON "_ItemToProduct"("B");

-- AddForeignKey
ALTER TABLE "_ItemToProduct" ADD FOREIGN KEY ("A") REFERENCES "items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemToProduct" ADD FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
