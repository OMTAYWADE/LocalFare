-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TravelSourcePlatform" AS ENUM ('YOUTUBE', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "TravelSourceType" AS ENUM ('CHANNEL', 'PROFILE', 'VIDEO', 'POST');

-- CreateEnum
CREATE TYPE "TravelProcessingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TravelTransportMode" AS ENUM ('WALK', 'BUS', 'TRAIN', 'METRO', 'SHARED_AUTO', 'METER_AUTO', 'TAXI', 'APP_TAXI', 'FERRY', 'FLIGHT', 'OTHER', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "FareSource" AS ENUM ('EXPLICIT', 'CALCULATED', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "TravelExpenseCategory" AS ENUM ('TRANSPORT', 'FOOD', 'SHOPPING', 'HOTEL', 'ATTRACTION', 'SERVICE', 'OTHER');

-- CreateEnum
CREATE TYPE "TravelExperienceType" AS ENUM ('POSITIVE', 'NEGATIVE', 'NEUTRAL', 'WARNING', 'POSSIBLE_OVERCHARGE', 'REPORTED_SCAM');

-- CreateEnum
CREATE TYPE "TravelVisibility" AS ENUM ('PRIVATE', 'FAIRTRIP_CANDIDATE', 'FAIRTRIP_PUBLIC');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "expenseCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "knownDistanceMeters" INTEGER,
ADD COLUMN     "knownDurationMinutes" INTEGER,
ADD COLUMN     "placeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "routeCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sourceCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "TripStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "totalKnownSpendInr" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalOtherSpendInr" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "totalTransportSpendInr" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordHash" TEXT;

-- CreateTable
CREATE TABLE "TravelSource" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "platform" "TravelSourcePlatform" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "sourceId" TEXT,
    "sourceType" "TravelSourceType" NOT NULL,
    "title" TEXT,
    "channelName" TEXT,
    "publishedAt" TIMESTAMP(3),
    "thumbnailUrl" TEXT,
    "contentId" TEXT,
    "transcriptProvided" BOOLEAN NOT NULL DEFAULT false,
    "processingStatus" "TravelProcessingStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelPlace" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "sequence" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelPlace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelRoute" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "fromName" TEXT NOT NULL,
    "toName" TEXT NOT NULL,
    "fromCity" TEXT,
    "toCity" TEXT,
    "transportMode" "TravelTransportMode" NOT NULL,
    "distanceMeters" INTEGER,
    "durationMinutes" INTEGER,
    "amountPaidInr" INTEGER,
    "fareSource" "FareSource" NOT NULL DEFAULT 'UNKNOWN',
    "experience" TEXT,
    "evidence" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelExpense" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "sequence" INTEGER,
    "category" "TravelExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "amountInr" INTEGER NOT NULL,
    "placeName" TEXT,
    "evidence" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TravelExpense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TravelExperience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "sourceId" TEXT,
    "sequence" INTEGER,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "experienceType" "TravelExperienceType" NOT NULL,
    "category" "TravelExpenseCategory" NOT NULL,
    "subcategory" TEXT,
    "placeName" TEXT,
    "city" TEXT,
    "reportedAmountInr" INTEGER,
    "expectedAmountInr" INTEGER,
    "transportMode" "TravelTransportMode",
    "problem" TEXT,
    "advice" TEXT[],
    "sourceQuote" TEXT,
    "confidence" DOUBLE PRECISION NOT NULL,
    "visibility" "TravelVisibility" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TravelExperience_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TravelSource_userId_idx" ON "TravelSource"("userId");

-- CreateIndex
CREATE INDEX "TravelSource_tripId_idx" ON "TravelSource"("tripId");

-- CreateIndex
CREATE INDEX "TravelSource_contentId_idx" ON "TravelSource"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "TravelSource_tripId_sourceUrl_key" ON "TravelSource"("tripId", "sourceUrl");

-- CreateIndex
CREATE INDEX "TravelPlace_userId_idx" ON "TravelPlace"("userId");

-- CreateIndex
CREATE INDEX "TravelPlace_tripId_idx" ON "TravelPlace"("tripId");

-- CreateIndex
CREATE INDEX "TravelPlace_tripId_sequence_idx" ON "TravelPlace"("tripId", "sequence");

-- CreateIndex
CREATE INDEX "TravelRoute_userId_idx" ON "TravelRoute"("userId");

-- CreateIndex
CREATE INDEX "TravelRoute_tripId_idx" ON "TravelRoute"("tripId");

-- CreateIndex
CREATE INDEX "TravelRoute_tripId_sequence_idx" ON "TravelRoute"("tripId", "sequence");

-- CreateIndex
CREATE INDEX "TravelExpense_userId_idx" ON "TravelExpense"("userId");

-- CreateIndex
CREATE INDEX "TravelExpense_tripId_idx" ON "TravelExpense"("tripId");

-- CreateIndex
CREATE INDEX "TravelExpense_tripId_sequence_idx" ON "TravelExpense"("tripId", "sequence");

-- CreateIndex
CREATE INDEX "TravelExperience_userId_idx" ON "TravelExperience"("userId");

-- CreateIndex
CREATE INDEX "TravelExperience_tripId_idx" ON "TravelExperience"("tripId");

-- CreateIndex
CREATE INDEX "TravelExperience_sourceId_idx" ON "TravelExperience"("sourceId");

-- CreateIndex
CREATE INDEX "Trip_status_idx" ON "Trip"("status");

-- AddForeignKey
ALTER TABLE "TravelSource" ADD CONSTRAINT "TravelSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelSource" ADD CONSTRAINT "TravelSource_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPlace" ADD CONSTRAINT "TravelPlace_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelPlace" ADD CONSTRAINT "TravelPlace_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelRoute" ADD CONSTRAINT "TravelRoute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelRoute" ADD CONSTRAINT "TravelRoute_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelExpense" ADD CONSTRAINT "TravelExpense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelExpense" ADD CONSTRAINT "TravelExpense_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelExperience" ADD CONSTRAINT "TravelExperience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelExperience" ADD CONSTRAINT "TravelExperience_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TravelExperience" ADD CONSTRAINT "TravelExperience_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "TravelSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
