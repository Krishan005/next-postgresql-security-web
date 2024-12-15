import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY: any = process.env.SECRATE_KEY;

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: No token provided",
            });
        }

        const token = authHeader.split(" ")[1];
        try {
            jwt.verify(token, SECRET_KEY);
        } catch (error) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: Invalid token",
            });
        }

        const users = await prisma.user.findMany({
            orderBy: { id: "desc" },
        });

        return NextResponse.json({
            status: 200,
            message: "Users fetched successfully",
            data: users,
        });
    } catch (error:any) {
        return NextResponse.json({
            status: 500,
            message: "Server error",
            error: error.message,
        });
    }
}
