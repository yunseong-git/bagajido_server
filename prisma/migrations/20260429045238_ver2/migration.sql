/*
  Warnings:

  - You are about to drop the column `store_id` on the `menus` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `store_likes` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `store_picks` table. All the data in the column will be lost.
  - The primary key for the `stores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `address` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `owner_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the `store_stats` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_id,place_id]` on the table `store_likes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,place_id]` on the table `store_picks` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `place_id` to the `menus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `store_likes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `store_picks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "menus" DROP CONSTRAINT "menus_store_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_store_id_fkey";

-- DropForeignKey
ALTER TABLE "store_likes" DROP CONSTRAINT "store_likes_store_id_fkey";

-- DropForeignKey
ALTER TABLE "store_picks" DROP CONSTRAINT "store_picks_store_id_fkey";

-- DropForeignKey
ALTER TABLE "store_stats" DROP CONSTRAINT "store_stats_store_id_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_owner_id_fkey";

-- DropIndex
DROP INDEX "menus_store_id_idx";

-- DropIndex
DROP INDEX "orders_store_id_idx";

-- DropIndex
DROP INDEX "store_likes_store_id_idx";

-- DropIndex
DROP INDEX "store_likes_user_id_store_id_key";

-- DropIndex
DROP INDEX "store_picks_store_id_idx";

-- DropIndex
DROP INDEX "store_picks_user_id_store_id_key";

-- DropIndex
DROP INDEX "stores_owner_id_idx";

-- AlterTable
ALTER TABLE "menus" DROP COLUMN "store_id",
ADD COLUMN     "place_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "store_id",
ADD COLUMN     "place_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "store_likes" DROP COLUMN "store_id",
ADD COLUMN     "place_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "store_picks" DROP COLUMN "store_id",
ADD COLUMN     "place_id" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "stores" DROP CONSTRAINT "stores_pkey",
DROP COLUMN "address",
DROP COLUMN "id",
DROP COLUMN "location",
DROP COLUMN "owner_id",
ADD COLUMN     "ai_summary_line" VARCHAR(500),
ADD COLUMN     "avg_value_score" DECIMAL(5,2),
ADD COLUMN     "category" VARCHAR(100),
ADD COLUMN     "latitude" DECIMAL(10,7),
ADD COLUMN     "like_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "longitude" DECIMAL(10,7),
ADD COLUMN     "pick_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "place_id" VARCHAR(255) NOT NULL,
ADD COLUMN     "review_count" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("place_id");

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "store_stats";

-- CreateTable
CREATE TABLE "owners" (
    "id" UUID NOT NULL,
    "oauth_provider" VARCHAR(32) NOT NULL,
    "oauth_subject" VARCHAR(255) NOT NULL,
    "email" VARCHAR(320),
    "display_name" VARCHAR(100),
    "phone_number" VARCHAR(32),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "owners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_details" (
    "place_id" VARCHAR(255) NOT NULL,
    "owner_id" UUID,
    "address" VARCHAR(500),
    "contact_number" VARCHAR(50),
    "opening_hours" VARCHAR(500),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_details_pkey" PRIMARY KEY ("place_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "owners_oauth_provider_oauth_subject_key" ON "owners"("oauth_provider", "oauth_subject");

-- CreateIndex
CREATE INDEX "store_details_owner_id_idx" ON "store_details"("owner_id");

-- CreateIndex
CREATE INDEX "menus_place_id_idx" ON "menus"("place_id");

-- CreateIndex
CREATE INDEX "orders_place_id_idx" ON "orders"("place_id");

-- CreateIndex
CREATE INDEX "store_likes_place_id_idx" ON "store_likes"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_likes_user_id_place_id_key" ON "store_likes"("user_id", "place_id");

-- CreateIndex
CREATE INDEX "store_picks_place_id_idx" ON "store_picks"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_picks_user_id_place_id_key" ON "store_picks"("user_id", "place_id");

-- AddForeignKey
ALTER TABLE "store_details" ADD CONSTRAINT "store_details_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "stores"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_details" ADD CONSTRAINT "store_details_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "owners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_likes" ADD CONSTRAINT "store_likes_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "stores"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_picks" ADD CONSTRAINT "store_picks_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "stores"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menus" ADD CONSTRAINT "menus_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "stores"("place_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "stores"("place_id") ON DELETE RESTRICT ON UPDATE CASCADE;
