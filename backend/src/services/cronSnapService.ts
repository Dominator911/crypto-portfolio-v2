import cron from "node-cron";
import prisma from "../prisma.js";
import { getEthBalance } from "./balanceService.js";
import { getEthPrice } from "./priceService.js";

const takeGlobalSnapshot = async () => {
    try {
        const wallets = await prisma.wallet.findMany();

        const price = await getEthPrice();

        let count = 0;
        for (const wallet of wallets) {
            try {
                const balance = await getEthBalance(wallet.address);
                const valueUSD = parseFloat(balance) * price;

                await prisma.snapshot.create({
                    data: {
                        totalValue: valueUSD,
                        walletId: wallet.id,
                        userId: wallet.userId
                    }
                });
                count++;
            } catch(err) {
                console.error(`Failed to snapshot wallet ${wallet.address}:`,err.message);
            }
        }
        console.log(`Snapshot complete! Saved ${count} records.`);
    } catch(err) {
        console.error('Snapshot Critical Fail:', err);
    }
};

export const startCronJob = () => {
    cron.schedule("* * * * *", () => {
        takeGlobalSnapshot();
    });
    console.log('Cron Job scheduled (Every 1 Minute)');
};