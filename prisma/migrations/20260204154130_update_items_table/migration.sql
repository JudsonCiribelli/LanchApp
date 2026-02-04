/*
  Warnings:

  - Made the column `productId` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "items" ALTER COLUMN "productId" SET NOT NULL;
