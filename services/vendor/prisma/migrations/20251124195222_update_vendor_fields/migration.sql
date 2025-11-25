/*
  Warnings:

  - You are about to drop the column `name` on the `vendors` table. All the data in the column will be lost.
  - Added the required column `address` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_name` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `business_type` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `vendors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip_code` to the `vendors` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "vendors" DROP COLUMN "name",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "business_name" TEXT NOT NULL,
ADD COLUMN     "business_type" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "contact_phone" TEXT,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "zip_code" TEXT NOT NULL;
