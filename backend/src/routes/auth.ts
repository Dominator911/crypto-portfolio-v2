import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import prisma from "../db.js";

const router = Router();
const isProd = process.env.NODE_ENV === "production";

// POST /api/auth/register - register a new user
router.post("/register", async (req, res) => {
    try {
        // Extract and validate input        
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

        // Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        }); 

        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        } 

        // Hash password with bcrypt using cost factor 10
        // TODO: increase cost in production if performance allows
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
            process.env.JWT_SECRET,
            {expiresIn: "7d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Return the created user (without password)
        return res.status(201).json({user});
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// POST /api/auth/login - verify credentials, issue JWT cookie on success
router.post("/login", async (req, res) => {
    try{
        //TODO: add rate limiting

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
            process.env.JWT_SECRET,
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

// POST /api/auth/logout - clear auth cookie to log the user out
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

export default router;