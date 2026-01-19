/*
  Warnings:

  - You are about to drop the `SnapshotWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SnapshotWallet" DROP CONSTRAINT "SnapshotWallet_snapshotId_fkey";

-- DropTable
DROP TABLE "SnapshotWallet";

-- CreateTable
CREATE TABLE "SnapshotAsset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "asset" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "snapshotId" TEXT NOT NULL,

    CONSTRAINT "SnapshotAsset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SnapshotAsset_snapshotId_asset_key" ON "SnapshotAsset"("snapshotId", "asset");

-- AddForeignKey
ALTER TABLE "SnapshotAsset" ADD CONSTRAINT "SnapshotAsset_snapshotId_fkey" FOREIGN KEY ("snapshotId") REFERENCES "Snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
