/*
  Warnings:

  - You are about to drop the column `paid` on the `OrderProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderProduct" DROP COLUMN "paid",
ADD COLUMN     "paidQuantity" INTEGER NOT NULL DEFAULT 0;
