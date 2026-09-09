-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "PlaceStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PlaceExternalProvider" AS ENUM ('TOUR_API', 'INTERNAL');

-- CreateEnum
CREATE TYPE "VisitExperienceType" AS ENUM ('VISIT_ONLY', 'FREE_EXPERIENCE', 'PAID_EXPERIENCE');

-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('UNKNOWN', 'LOCAL', 'DOMESTIC_VISITOR', 'INTERNATIONAL_VISITOR');

-- CreateEnum
CREATE TYPE "VisitVerificationType" AS ENUM ('SELF_REPORTED', 'LOCATION', 'RECEIPT', 'BOOKING', 'ADMIN');

-- CreateEnum
CREATE TYPE "RatingMetricDirection" AS ENUM ('HIGHER_IS_BETTER', 'HIGHER_IS_WORSE');

-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('ACTIVE', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "StorageProvider" AS ENUM ('S3', 'R2');

-- CreateEnum
CREATE TYPE "MomentStatus" AS ENUM ('ACTIVE', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "WikiSectionStatus" AS ENUM ('ACTIVE', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "WikiRevisionType" AS ENUM ('CREATE', 'EDIT', 'ROLLBACK');

-- CreateEnum
CREATE TYPE "RecordStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DELETED', 'HIDDEN');

-- CreateEnum
CREATE TYPE "RecordVisibility" AS ENUM ('PUBLIC', 'FOLLOWERS', 'PRIVATE');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "authUserId" UUID,
    "username" VARCHAR(30) NOT NULL,
    "displayName" VARCHAR(50) NOT NULL,
    "bio" VARCHAR(500),
    "profileImageKey" TEXT,
    "nationalityCode" CHAR(2),
    "residenceCountryCode" CHAR(2),
    "preferredLocale" VARCHAR(10) NOT NULL DEFAULT 'ko-KR',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "withdrawnAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_categories" (
    "id" UUID NOT NULL,
    "parentId" UUID,
    "key" VARCHAR(50) NOT NULL,
    "nameKo" VARCHAR(100) NOT NULL,
    "nameEn" VARCHAR(100),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "place_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" UUID NOT NULL,
    "categoryId" UUID,
    "name" VARCHAR(200) NOT NULL,
    "normalizedName" VARCHAR(200),
    "address" TEXT,
    "normalizedAddress" TEXT,
    "postalCode" VARCHAR(20),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "businessNumber" VARCHAR(20),
    "phone" VARCHAR(50),
    "websiteUrl" TEXT,
    "description" TEXT,
    "operationInfo" JSONB,
    "priceInfo" JSONB,
    "status" "PlaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "archivedAt" TIMESTAMPTZ(6),
    "archiveReason" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_external_sources" (
    "id" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "provider" "PlaceExternalProvider" NOT NULL,
    "externalId" VARCHAR(255) NOT NULL,
    "externalType" VARCHAR(100),
    "sourceUpdatedAt" TIMESTAMPTZ(6),
    "syncedAt" TIMESTAMPTZ(6),
    "rawData" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "place_external_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_visits" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "visitedOn" DATE NOT NULL,
    "visitedAt" TIMESTAMPTZ(6),
    "experienceType" "VisitExperienceType" NOT NULL DEFAULT 'VISIT_ONLY',
    "visitorType" "VisitorType" NOT NULL DEFAULT 'UNKNOWN',
    "verificationType" "VisitVerificationType" NOT NULL DEFAULT 'SELF_REPORTED',
    "verifiedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "place_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_metric_definitions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "labelKo" VARCHAR(100) NOT NULL,
    "labelEn" VARCHAR(100),
    "description" VARCHAR(500),
    "direction" "RatingMetricDirection" NOT NULL DEFAULT 'HIGHER_IS_BETTER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "rating_metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_rating_metrics" (
    "categoryId" UUID NOT NULL,
    "metricDefinitionId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_rating_metrics_pkey" PRIMARY KEY ("categoryId","metricDefinitionId")
);

-- CreateTable
CREATE TABLE "place_ratings" (
    "id" UUID NOT NULL,
    "visitId" UUID NOT NULL,
    "overallScore" SMALLINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "place_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "place_rating_metrics" (
    "ratingId" UUID NOT NULL,
    "metricDefinitionId" UUID NOT NULL,
    "score" SMALLINT NOT NULL,

    CONSTRAINT "place_rating_metrics_pkey" PRIMARY KEY ("ratingId","metricDefinitionId")
);

-- CreateTable
CREATE TABLE "place_comments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "visitId" UUID,
    "parentId" UUID,
    "content" VARCHAR(2000),
    "languageCode" VARCHAR(10),
    "status" "CommentStatus" NOT NULL DEFAULT 'ACTIVE',
    "editedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "place_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment_likes" (
    "userId" UUID NOT NULL,
    "commentId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("userId","commentId")
);

-- CreateTable
CREATE TABLE "moments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "visitId" UUID,
    "storageProvider" "StorageProvider" NOT NULL,
    "objectKey" TEXT NOT NULL,
    "caption" VARCHAR(1000),
    "languageCode" VARCHAR(10),
    "takenAt" TIMESTAMPTZ(6),
    "width" INTEGER,
    "height" INTEGER,
    "mimeType" VARCHAR(100),
    "sizeBytes" INTEGER,
    "status" "MomentStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "moments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moment_likes" (
    "userId" UUID NOT NULL,
    "momentId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "moment_likes_pkey" PRIMARY KEY ("userId","momentId")
);

-- CreateTable
CREATE TABLE "wiki_sections" (
    "id" UUID NOT NULL,
    "placeId" UUID NOT NULL,
    "parentId" UUID,
    "locale" VARCHAR(10) NOT NULL DEFAULT 'ko-KR',
    "currentRevisionId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isSystemSection" BOOLEAN NOT NULL DEFAULT false,
    "createdById" UUID,
    "status" "WikiSectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "wiki_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wiki_revisions" (
    "id" UUID NOT NULL,
    "sectionId" UUID NOT NULL,
    "editorId" UUID,
    "version" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "editSummary" VARCHAR(500),
    "type" "WikiRevisionType" NOT NULL DEFAULT 'EDIT',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wiki_revisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_follows" (
    "id" UUID NOT NULL,
    "followerId" UUID NOT NULL,
    "followingId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_reason_definitions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "labelKo" VARCHAR(100) NOT NULL,
    "labelEn" VARCHAR(100),
    "description" VARCHAR(500),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "follow_reason_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_reasons" (
    "followId" UUID NOT NULL,
    "reasonDefinitionId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follow_reasons_pkey" PRIMARY KEY ("followId","reasonDefinitionId")
);

-- CreateTable
CREATE TABLE "records" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" VARCHAR(2000),
    "coverMomentId" UUID,
    "startedOn" DATE,
    "endedOn" DATE,
    "visibility" "RecordVisibility" NOT NULL DEFAULT 'PUBLIC',
    "status" "RecordStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMPTZ(6),
    "deletedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "record_moments" (
    "recordId" UUID NOT NULL,
    "momentId" UUID NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "note" VARCHAR(1000),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "record_moments_pkey" PRIMARY KEY ("recordId","momentId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_authUserId_key" ON "users"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "place_categories_key_key" ON "place_categories"("key");

-- CreateIndex
CREATE INDEX "place_categories_parentId_idx" ON "place_categories"("parentId");

-- CreateIndex
CREATE INDEX "places_categoryId_idx" ON "places"("categoryId");

-- CreateIndex
CREATE INDEX "places_name_idx" ON "places"("name");

-- CreateIndex
CREATE INDEX "places_normalizedName_idx" ON "places"("normalizedName");

-- CreateIndex
CREATE INDEX "places_businessNumber_idx" ON "places"("businessNumber");

-- CreateIndex
CREATE INDEX "places_status_idx" ON "places"("status");

-- CreateIndex
CREATE INDEX "places_latitude_longitude_idx" ON "places"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "place_external_sources_placeId_idx" ON "place_external_sources"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "place_external_sources_provider_externalId_key" ON "place_external_sources"("provider", "externalId");

-- CreateIndex
CREATE INDEX "place_visits_userId_visitedOn_idx" ON "place_visits"("userId", "visitedOn");

-- CreateIndex
CREATE INDEX "place_visits_placeId_visitedOn_idx" ON "place_visits"("placeId", "visitedOn");

-- CreateIndex
CREATE INDEX "place_visits_userId_placeId_idx" ON "place_visits"("userId", "placeId");

-- CreateIndex
CREATE INDEX "place_visits_placeId_visitorType_idx" ON "place_visits"("placeId", "visitorType");

-- CreateIndex
CREATE UNIQUE INDEX "rating_metric_definitions_key_key" ON "rating_metric_definitions"("key");

-- CreateIndex
CREATE INDEX "rating_metric_definitions_isActive_idx" ON "rating_metric_definitions"("isActive");

-- CreateIndex
CREATE INDEX "category_rating_metrics_categoryId_sortOrder_idx" ON "category_rating_metrics"("categoryId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "place_ratings_visitId_key" ON "place_ratings"("visitId");

-- CreateIndex
CREATE INDEX "place_rating_metrics_metricDefinitionId_idx" ON "place_rating_metrics"("metricDefinitionId");

-- CreateIndex
CREATE INDEX "place_comments_placeId_status_createdAt_idx" ON "place_comments"("placeId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "place_comments_userId_createdAt_idx" ON "place_comments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "place_comments_visitId_idx" ON "place_comments"("visitId");

-- CreateIndex
CREATE INDEX "place_comments_parentId_idx" ON "place_comments"("parentId");

-- CreateIndex
CREATE INDEX "comment_likes_commentId_createdAt_idx" ON "comment_likes"("commentId", "createdAt");

-- CreateIndex
CREATE INDEX "moments_placeId_status_createdAt_idx" ON "moments"("placeId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "moments_userId_createdAt_idx" ON "moments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "moments_visitId_idx" ON "moments"("visitId");

-- CreateIndex
CREATE UNIQUE INDEX "moments_storageProvider_objectKey_key" ON "moments"("storageProvider", "objectKey");

-- CreateIndex
CREATE INDEX "moment_likes_momentId_createdAt_idx" ON "moment_likes"("momentId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "wiki_sections_currentRevisionId_key" ON "wiki_sections"("currentRevisionId");

-- CreateIndex
CREATE INDEX "wiki_sections_placeId_locale_status_sortOrder_idx" ON "wiki_sections"("placeId", "locale", "status", "sortOrder");

-- CreateIndex
CREATE INDEX "wiki_sections_parentId_sortOrder_idx" ON "wiki_sections"("parentId", "sortOrder");

-- CreateIndex
CREATE INDEX "wiki_sections_createdById_idx" ON "wiki_sections"("createdById");

-- CreateIndex
CREATE INDEX "wiki_revisions_sectionId_createdAt_idx" ON "wiki_revisions"("sectionId", "createdAt");

-- CreateIndex
CREATE INDEX "wiki_revisions_editorId_createdAt_idx" ON "wiki_revisions"("editorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "wiki_revisions_sectionId_version_key" ON "wiki_revisions"("sectionId", "version");

-- CreateIndex
CREATE INDEX "user_follows_followerId_createdAt_idx" ON "user_follows"("followerId", "createdAt");

-- CreateIndex
CREATE INDEX "user_follows_followingId_createdAt_idx" ON "user_follows"("followingId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_follows_followerId_followingId_key" ON "user_follows"("followerId", "followingId");

-- CreateIndex
CREATE UNIQUE INDEX "follow_reason_definitions_key_key" ON "follow_reason_definitions"("key");

-- CreateIndex
CREATE INDEX "follow_reason_definitions_isActive_sortOrder_idx" ON "follow_reason_definitions"("isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "follow_reasons_reasonDefinitionId_createdAt_idx" ON "follow_reasons"("reasonDefinitionId", "createdAt");

-- CreateIndex
CREATE INDEX "records_userId_status_createdAt_idx" ON "records"("userId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "records_userId_status_publishedAt_idx" ON "records"("userId", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "records_coverMomentId_idx" ON "records"("coverMomentId");

-- CreateIndex
CREATE INDEX "record_moments_momentId_idx" ON "record_moments"("momentId");

-- CreateIndex
CREATE UNIQUE INDEX "record_moments_recordId_sortOrder_key" ON "record_moments"("recordId", "sortOrder");

-- AddForeignKey
ALTER TABLE "place_categories" ADD CONSTRAINT "place_categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "place_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "place_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_external_sources" ADD CONSTRAINT "place_external_sources_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_visits" ADD CONSTRAINT "place_visits_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_visits" ADD CONSTRAINT "place_visits_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_rating_metrics" ADD CONSTRAINT "category_rating_metrics_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "place_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_rating_metrics" ADD CONSTRAINT "category_rating_metrics_metricDefinitionId_fkey" FOREIGN KEY ("metricDefinitionId") REFERENCES "rating_metric_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_ratings" ADD CONSTRAINT "place_ratings_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "place_visits"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_rating_metrics" ADD CONSTRAINT "place_rating_metrics_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "place_ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_rating_metrics" ADD CONSTRAINT "place_rating_metrics_metricDefinitionId_fkey" FOREIGN KEY ("metricDefinitionId") REFERENCES "rating_metric_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_comments" ADD CONSTRAINT "place_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_comments" ADD CONSTRAINT "place_comments_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_comments" ADD CONSTRAINT "place_comments_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "place_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "place_comments" ADD CONSTRAINT "place_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "place_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment_likes" ADD CONSTRAINT "comment_likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "place_comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moments" ADD CONSTRAINT "moments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moments" ADD CONSTRAINT "moments_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moments" ADD CONSTRAINT "moments_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "place_visits"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_likes" ADD CONSTRAINT "moment_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "moment_likes" ADD CONSTRAINT "moment_likes_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_sections" ADD CONSTRAINT "wiki_sections_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_sections" ADD CONSTRAINT "wiki_sections_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_sections" ADD CONSTRAINT "wiki_sections_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "wiki_sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_sections" ADD CONSTRAINT "wiki_sections_currentRevisionId_fkey" FOREIGN KEY ("currentRevisionId") REFERENCES "wiki_revisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_revisions" ADD CONSTRAINT "wiki_revisions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "wiki_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wiki_revisions" ADD CONSTRAINT "wiki_revisions_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_reasons" ADD CONSTRAINT "follow_reasons_followId_fkey" FOREIGN KEY ("followId") REFERENCES "user_follows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_reasons" ADD CONSTRAINT "follow_reasons_reasonDefinitionId_fkey" FOREIGN KEY ("reasonDefinitionId") REFERENCES "follow_reason_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "records" ADD CONSTRAINT "records_coverMomentId_fkey" FOREIGN KEY ("coverMomentId") REFERENCES "moments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record_moments" ADD CONSTRAINT "record_moments_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "record_moments" ADD CONSTRAINT "record_moments_momentId_fkey" FOREIGN KEY ("momentId") REFERENCES "moments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
