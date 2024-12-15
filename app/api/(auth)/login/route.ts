import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const key:any = process.env.SECRATE_KEY || 'secret_key';

export async function POST(request: Request) {
    const { email,  password,  } =
        await request.json();
    
    if (!email || !password) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    
    const user:any = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    
    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user?.password);
    
    if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid password" }, { status: 401 });
    }

    const token = jwt.sign({ id: user.id }, key, { expiresIn: '24h' });

    // create user data in base64

    const encriptedUser = Buffer.from(JSON.stringify(user)).toString('base64');
    
    
    return NextResponse.json({ 
        status: 200,
        message: "Login successful",
        user:encriptedUser,
        token
    });
}
