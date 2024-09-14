/*
  Warnings:

  - You are about to drop the column `paymentDate` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentDate";

-- AlterTable
ALTER TABLE "OrderProduct" ADD COLUMN     "paid" BOOLEAN NOT NULL DEFAULT false;
