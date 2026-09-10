/*
  Warnings:

  - You are about to drop the column `caption` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `objectKey` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `sizeBytes` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `storageProvider` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `takenAt` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `visitId` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `moments` table. All the data in the column will be lost.
  - You are about to drop the column `visitId` on the `place_ratings` table. All the data in the column will be lost.
  - You are about to drop the `comment_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `place_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `place_visits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `record_moments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `records` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wiki_revisions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wiki_sections` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[momentId]` on the table `place_ratings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `visitedOn` to the `moments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `momentId` to the `place_ratings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MomentExperienceType" AS ENUM ('VISIT_ONLY', 'FREE_EXPERIENCE', 'PAID_EXPERIENCE');

-- CreateEnum
CREATE TYPE "MomentVerificationType" AS ENUM ('SELF_REPORTED', 'LOCATION', 'RECEIPT', 'BOOKING', 'ADMIN');

-- CreateEnum
CREATE TYPE "MomentVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateEnum
CREATE TYPE "MomentCommentStatus" AS ENUM ('ACTIVE', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "SequenceStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "SequenceVisibility" AS ENUM ('PUBLIC', 'FOLLOWERS', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_commentId_fkey";

-- DropForeignKey
ALTER TABLE "comment_likes" DROP CONSTRAINT "comment_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "moments" DROP CONSTRAINT "moments_visitId_fkey";

-- DropForeignKey
ALTER TABLE "place_comments" DROP CONSTRAINT "place_comments_parentId_fkey";

-- DropForeignKey
ALTER TABLE "place_comments" DROP CONSTRAINT "place_comments_placeId_fkey";

-- DropForeignKey
ALTER TABLE "place_comments" DROP CONSTRAINT "place_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "place_comments" DROP CONSTRAINT "place_comments_visitId_fkey";

-- DropForeignKey
ALTER TABLE "place_ratings" DROP CONSTRAINT "place_ratings_visitId_fkey";

-- DropForeignKey
ALTER TABLE "place_visits" DROP CONSTRAINT "place_visits_placeId_fkey";

-- DropForeignKey
ALTER TABLE "place_visits" DROP CONSTRAINT "place_visits_userId_fkey";

-- DropForeignKey
ALTER TABLE "record_moments" DROP CONSTRAINT "record_moments_momentId_fkey";

-- DropForeignKey
ALTER TABLE "record_moments" DROP CONSTRAINT "record_moments_recordId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_coverMomentId_fkey";

-- DropForeignKey
ALTER TABLE "records" DROP CONSTRAINT "records_userId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_revisions" DROP CONSTRAINT "wiki_revisions_editorId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_revisions" DROP CONSTRAINT "wiki_revisions_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_sections" DROP CONSTRAINT "wiki_sections_createdById_fkey";

-- DropForeignKey
ALTER TABLE "wiki_sections" DROP CONSTRAINT "wiki_sections_currentRevisionId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_sections" DROP CONSTRAINT "wiki_sections_parentId_fkey";

-- DropForeignKey
ALTER TABLE "wiki_sections" DROP CONSTRAINT "wiki_sections_placeId_fkey";

-- DropIndex
DROP INDEX "moments_placeId_status_createdAt_idx";

-- DropIndex
DROP INDEX "moments_storageProvider_objectKey_key";

-- DropIndex
DROP INDEX "moments_userId_createdAt_idx";

-- DropIndex
DROP INDEX "moments_visitId_idx";

-- DropIndex
DROP INDEX "place_ratings_visitId_key";

-- AlterTable
ALTER TABLE "moments" DROP COLUMN "caption",
DROP COLUMN "height",
DROP COLUMN "mimeType",
DROP COLUMN "objectKey",
DROP COLUMN "sizeBytes",
DROP COLUMN "storageProvider",
DROP COLUMN "takenAt",
DROP COLUMN "visitId",
DROP COLUMN "width",
ADD COLUMN     "content" VARCHAR(2000),
ADD COLUMN     "experienceType" "MomentExperienceType" NOT NULL DEFAULT 'VISIT_ONLY',
ADD COLUMN     "verificationType" "MomentVerificationType" NOT NULL DEFAULT 'SELF_REPORTED',
ADD COLUMN     "verifiedAt" TIMESTAMPTZ(6),
ADD COLUMN     "visibility" "MomentVisibility" NOT NULL DEFAULT 'PRIVATE',
ADD COLUMN     "visitedAt" TIMESTAMPTZ(6),
ADD COLUMN     "visitedOn" DATE NOT NULL,
ADD COLUMN     "visitorType" "VisitorType" NOT NULL DEFAULT 'UNKNOWN';

-- AlterTable
ALTER TABLE "place_ratings" DROP COLUMN "visitId",
ADD COLUMN     "momentId" UUID NOT NULL;

-- DropTable
DROP TABLE "comment_likes";

-- DropTable
DROP TABLE "place_comments";

-- DropTable
DROP TABLE "place_visits";

-- DropTable
DROP TABLE "record_moments";

-- DropTable
DROP TABLE "records";

-- DropTable
DROP TABLE "wiki_revisions";

-- DropTable
DROP TABLE "wiki_sections";

-- DropEnum
DROP TYPE "CommentStatus";

-- DropEnum
DROP TYPE "RecordStatus";

-- DropEnum
DROP TYPE "RecordVisibility";

-- DropEnum
DROP TYPE "VisitExperienceType";

-- DropEnum
DROP TYPE "VisitVerificationType";

-- DropEnum
DROP TYPE "WikiRevisionType";

-- DropEnum
DROP TYPE "WikiSectionStatus";

-- CreateTable
CREATE TABLE "moment_images" (
    "id" UUID NOT NULL,
    "momentId" UUID NOT NULL,
    "storageProvider" "StorageProvider" NOT NULL,
    "objectKey" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "takenAt" TIMESTAMPTZ(6),
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" VARCHAR(100),
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moment_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moment_comments" (
    "id" UUID NOT NULL,
    "momentId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "parentId" UUID,
    "content" VARCHAR(2000),
    "languageCode" VARCHAR(10),
    "status" "MomentCommentStatus" NOT NULL DEFAULT 'ACTIVE',
    "editedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "moment_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moment_comment_likes" (
    "userId" UUID NOT NULL,
    "commentId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moment_comment_likes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "sequences" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(2000),
    "coverMomentId" UUID,
    "visibility" "SequenceVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "SequenceStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "sequences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sequence_moments" (
    "sequenceId" UUID NOT NULL,
    "momentId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "note" VARCHAR(1000),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sequence_moments_pkey" PRIMARY KEY ("sequenceId","momentId")
);

-- CreateIndex
CREATE INDEX "moment_images_momentId_sortOrder_idx" ON "moment_images"("momentId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "moment_images_storageProvider_objectKey_key" ON "moment_images"("storageProvider", "objectKey");

-- CreateIndex
CREATE INDEX "moment_comments_momentId_status_createdAt_idx" ON "moment_comments"("momentId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "moment_comments_userId_createdAt_idx" ON "moment_comments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "moment_comments_parentId_createdAt_idx" ON "moment_comments"("parentId", "createdAt");

-- CreateIndex
CREATE INDEX "moment_comment_likes_commentId_createdAt_idx" ON "moment_comment_likes"("commentId", "createdAt");

-- CreateIndex
CREATE INDEX "sequences_userId_status_createdAt_idx" ON "sequences"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "sequences_userId_status_publishedAt_idx" ON "sequences"("userId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "sequences_coverMomentId_idx" ON "sequences"("coverMomentId");

-- CreateIndex
CREATE INDEX "sequence_moments_sequenceId_sortOrder_idx" ON "sequence_moments"("sequenceId", "sortOrder");

-- CreateIndex
CREATE INDEX "sequence_moments_momentId_idx" ON "sequence_moments"("momentId");

-- CreateIndex
CREATE INDEX "moments_userId_status_visitedOn_idx" ON "moments"("userId", "status", "visitedOn");

-- CreateIndex
CREATE INDEX "moments_placeId_visibility_status_createdAt_idx" ON "moments"("placeId", "visibility", "status", "createdAt");

-- CreateIndex
CREATE INDEX "moments_userId_placeId_idx" ON "moments"("userId", "placeId");

-- CreateIndex
CREATE INDEX "moments_placeId_visitorType_idx" ON "moments"("placeId", "visitorType");

-- CreateIndex
CREATE UNIQUE INDEX "place_ratings_momentId_key" ON "place_ratings"("momentId");

-- AddForeignKey
ALTER TABLE "moment_images" ADD CONSTRAINT "moment_images_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_ratings" ADD CONSTRAINT "place_ratings_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_comments" ADD CONSTRAINT "moment_comments_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_comments" ADD CONSTRAINT "moment_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_comments" ADD CONSTRAINT "moment_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "moment_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_comment_likes" ADD CONSTRAINT "moment_comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_comment_likes" ADD CONSTRAINT "moment_comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "moment_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequences" ADD CONSTRAINT "sequences_coverMomentId_fkey" FOREIGN KEY ("coverMomentId") REFERENCES "moments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_moments" ADD CONSTRAINT "sequence_moments_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES "sequences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sequence_moments" ADD CONSTRAINT "sequence_moments_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
