import { Request, Response, NextFunction } from 'express';
import prisma from "../db.js";

export async function fakeAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: "test-user-1" },
    });

    (req as any).user = user;
    (req as any).userId = user?.id;

    next();
  } catch (error) {
    console.error("Fake Auth Error:", error);
    next(error);
  }
}