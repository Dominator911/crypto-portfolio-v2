import express from "express";
import { isAddress } from "viem";
import prisma from "../db.js";

const router = express.Router();

  

// GET/wallets - fetch wallets
router.get('/', async (req, res) => {
    try {
        const wallets = await prisma.wallet.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" }
        });
        res.status(200).json(wallets);

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch wallets" });
    }

})

// POST/wallet - add wallet
router.post('/', async (req, res) => {
    try {
        const { address, name, chain } = req.body;
        
        if (!address) return res.status(400).json({ error: "Address is required" });
        if (!isAddress(address)) return res.status(400).json({ error: "Invalid wallet address"});

        const newWallet = await prisma.wallet.create({
            data: {
                address: address,
                name: name || "My Wallet",
                chain: chain || "ethereum",
                userId: req.userId
            }
        });
        res.status(201).json(newWallet);

        console.log("Added wallet:", newWallet);
    
    } catch (error) {
        
        if (error.code === 'P2002') {
            return res.status(400).json({ error: "Wallet address already exists" });
        }

        res.status(500).json({ error: "Failed to add wallet" });
    }
})

// DELETE/wallet - delete wallet
router.delete('/:id', async (req, res) => {
    try {

        const { id } = req.params;

        const result = await prisma.wallet.deleteMany({
            where: {
                id: id,
                userId: req.userId,
            }
        });

        console.log("userId:", req.userId, "walletId:", req.params.id);   

        if (result.count === 0) {
            return res.status(404).json({ error: "Wallet not found or unauthorized" });

    
    }

        res.status(200).json({ message: "Wallet deleted successfuly" });
        
    } catch (error) {
        
        res.status(500).json({ error: "Failed to delete wallet" });
        
    } 
    
})

export default router;