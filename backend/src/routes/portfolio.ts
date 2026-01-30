import { Router } from "express";
import prisma from '../db.js';
import { getEthBalance } from '../services/balanceService.js';
import { getEthPrice } from '../services/priceService.js';

const router = Router();

router.get("/latest", async (req, res) => {
    try {
        const latestSnapshot = await prisma.snapshot.findFirst({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
            select: {
                totalValue: true,
                createdAt: true
            }
        });

        if (!latestSnapshot) {
            return res.status(404).json({ 
                message: "No portfolio data available" 
            });
        }

         res.status(200).json({
            totalValue: latestSnapshot.totalValue,
            lastUpdated: latestSnapshot.createdAt,
        });
    } catch (error) {
        console.error("Failed to fetch latest portfolio:", error);
        res.status(500).json({ message: "Failed to fetch portfolio data" });
    }
});

router.get("/history", async (req, res) => {
    try {
        const snapshots = await prisma.snapshot.findMany({
            where: { userId: req.userId },
            select: {
                createdAt: true,
                totalValue: true
            },
            orderBy: { createdAt: "desc" }
        });

        // Transform to match frontend expectations
        const history = snapshots.map(snapshot => ({
            date: snapshot.createdAt.toISOString().split('T')[0], // YYYY-MM-DD format
            value: snapshot.totalValue
        }));

        res.status(200).json(history);
        
    } catch (error) {
        console.error("Failed to fetch portfolio history:", error);
        res.status(500).json({ message: "Failed to fetch history" });
    }
});

export default router;