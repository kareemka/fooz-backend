/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `discountPrice` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "customerEmail";

-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "colorImage" TEXT,
ADD COLUMN     "sizeDimensions" TEXT;

-- AlterTable
ALTER TABLE "OrderItemAccessory" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "discountPrice",
ADD COLUMN     "discountPercentage" DOUBLE PRECISION;
