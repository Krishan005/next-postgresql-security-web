import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const prisma:any = new PrismaClient();

export async function POST(request: Request) {
    const { name, email, phone, password, confirmPassword , role} =
        await request.json();
    
    if (!name || !email || !phone || !password || !confirmPassword) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    
    if (password !== confirmPassword) {
        return NextResponse.json({ message: "Passwords do not match" }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    var roleId = role || 0
    
    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            password: hashedPassword,
             role: Number(roleId)
        },
    });
    
    return NextResponse.json({
        status: 200,
        message: "User created successfully",
        user,
    });
}