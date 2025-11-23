-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('DELIVERY', 'PICKUP', 'DINE_IN');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "type" "OrderType" NOT NULL DEFAULT E'DELIVERY';
