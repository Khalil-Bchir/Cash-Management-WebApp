/*
  Warnings:

  - You are about to drop the `ItemPayment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemPayment" DROP CONSTRAINT "ItemPayment_orderProductId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropTable
DROP TABLE "ItemPayment";

-- DropTable
DROP TABLE "Payment";
