import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import prisma from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
const isProd = process.env.NODE_ENV === "production";

router.post("/register", async (req, res) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existing = await prisma.user.findUnique({
            where: { email },
        }); 

        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        } 

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({user});
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/login", async (req, res) => {
    try{
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password;

        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await prisma.user.findUnique({
            where: { email },
        }); 

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials"});
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials"});

        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        
        return res.json({ 
            user: {
                id: user.id, 
                email: user.email,
                createdAt: user.createdAt, 
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });

    return res.json({ message: "Logged out" });
});

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: (req as any).userId },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Failed to fetch user:", error);
        res.status(500).json({ message: "Failed to fetch user data" });
    }
});

export default router;