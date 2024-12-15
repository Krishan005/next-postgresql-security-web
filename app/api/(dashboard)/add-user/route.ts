import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma: any = new PrismaClient();

const SECRET_KEY: any = process.env.SECRET_KEY || 'secret_key';

const ADMIN_ROLE = "2";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized: Invalid token",
      });
    }

    // if (decodedToken.role !== ADMIN_ROLE) {
    //   return NextResponse.json({
    //     status: 403,
    //     message: "Forbidden: You do not have permission to add users",
    //   });
    // }

    // Step 3: Extract user details from the request body
    const { name, email, phone, password, confirmPassword, role } =
      await request.json();

    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role, 
      },
    });

    return NextResponse.json({
      status: 200,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
