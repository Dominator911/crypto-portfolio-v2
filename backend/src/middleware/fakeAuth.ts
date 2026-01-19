import prisma from "../db.js";

export async function fakeAuth( req: any, res: any, next: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: "test-user-1" }, 
    });

    req.user = user;
    req.userId = user?.id;
    
    next();
  } catch (error) {
    console.error("Fake Auth Error:", error);
    next(error);
  }
}