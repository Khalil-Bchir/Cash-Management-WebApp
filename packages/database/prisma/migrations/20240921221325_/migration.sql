/*
  Warnings:

  - Added the required column `deleveryDate` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deleveryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false;
