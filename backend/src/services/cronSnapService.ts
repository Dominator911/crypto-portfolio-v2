import cron from "node-cron";
import prisma from "../db.js";
import { supportedAssets } from "./assets.js";
import { getPrices } from "./priceService.js";

const takeSnapshots = async () => {
    
    try {
        const symbols = supportedAssets.map(a => a.symbol.toLowerCase());
        const prices = await getPrices(symbols); 

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

                const price = prices[asset.symbol.toLowerCase()];
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
    cron.schedule("0 0 * * *", () => {
        takeSnapshots();
    });
    console.log('Cron Job scheduled every day at minute 0');
};