import jwt from 'jsonwebtoken';
import prisma from '../db.js';

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

export async function authMiddleware(req: any, res: any, next: any) {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated"});
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.userId = user.id
        req.user = user;

        next();

    } catch (err) {
        console.error("Auth error:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};