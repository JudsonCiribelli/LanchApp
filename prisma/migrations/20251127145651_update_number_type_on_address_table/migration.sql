/*
  Warnings:

  - The `number` column on the `addresses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `zipCode` on the `addresses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "number",
ADD COLUMN     "number" INTEGER,
DROP COLUMN "zipCode",
ADD COLUMN     "zipCode" INTEGER NOT NULL;
