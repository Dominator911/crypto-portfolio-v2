/*
  Warnings:

  - You are about to drop the column `userId` on the `SnapshotAsset` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,createdAt]` on the table `Snapshot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[snapshotId,asset]` on the table `SnapshotAsset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Snapshot` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SnapshotAsset" DROP CONSTRAINT "SnapshotAsset_userId_fkey";

-- DropIndex
DROP INDEX "SnapshotAsset_snapshotId_userId_asset_key";

-- AlterTable
ALTER TABLE "Snapshot" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SnapshotAsset" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "Snapshot_userId_createdAt_key" ON "Snapshot"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotAsset_snapshotId_asset_key" ON "SnapshotAsset"("snapshotId", "asset");

-- AddForeignKey
ALTER TABLE "Snapshot" ADD CONSTRAINT "Snapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
