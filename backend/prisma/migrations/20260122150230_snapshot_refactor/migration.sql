/*
  Warnings:

  - You are about to drop the column `walletId` on the `Snapshot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[snapshotId,userId,asset]` on the table `SnapshotAsset` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `SnapshotAsset` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Snapshot" DROP CONSTRAINT "Snapshot_walletId_fkey";

-- DropIndex
DROP INDEX "Snapshot_walletId_createdAt_key";

-- DropIndex
DROP INDEX "SnapshotAsset_snapshotId_asset_key";

-- AlterTable
ALTER TABLE "Snapshot" DROP COLUMN "walletId";

-- AlterTable
ALTER TABLE "SnapshotAsset" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotAsset_snapshotId_userId_asset_key" ON "SnapshotAsset"("snapshotId", "userId", "asset");

-- AddForeignKey
ALTER TABLE "SnapshotAsset" ADD CONSTRAINT "SnapshotAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
