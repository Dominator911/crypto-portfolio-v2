import cron from "node-cron";
import prisma from "../db.js";
import { supportedAssets } from "./assets.js";
import { getPrices } from "./priceService.js";

const takeSnapshots = async () => {
    
    try {
        const coingeckoIds = supportedAssets.map(a => a.coingeckoId);
        const prices = await getPrices(coingeckoIds);
        console.log(`Fetched prices:`, prices);

        const users = await prisma.user.findMany();

        for (const user of users) {
            const wallets = await prisma.wallet.findMany({
                where: { userId: user.id }
            });

            let totalValue = 0;

            const snapshot = await prisma.snapshot.create({
                    data: {
                        userId: user.id,
                        totalValue: totalValue,
                    },
                });

            for (const asset of supportedAssets) {
                let assetTotalBalance = 0;

                for (const wallet of wallets) {
                    if (wallet.chain !== asset.chain) continue;

                    const balance = await asset.getBalance(wallet.address);
                    assetTotalBalance += balance;
                }

                const price = prices[asset.coingeckoId];
                if (!price || price === 0) {
                    console.warn(`Warning: Price for ${asset.symbol} (${asset.coingeckoId}) is ${price}`);
                }
                const valueCAD = assetTotalBalance * price;

                await prisma.snapshotAsset.create({
                    data: {
                        snapshotId: snapshot.id,
                        asset: asset.symbol,
                        balance: assetTotalBalance,
                        price,
                    },
                });

                totalValue += valueCAD;
            } 

            await prisma.snapshot.update({
                where: { id: snapshot.id },
                data: { totalValue: totalValue },
            });
        } 
    } catch (error) {
        console.log("Error taking snapshot:", error);
    }
};

export const startCronJob = () => {
    cron.schedule("*/15 * * * *", () => {
        takeSnapshots();
    });
    console.log('Cron Job scheduled every day at minute 0');
};