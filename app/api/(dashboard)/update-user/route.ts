import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma: any = new PrismaClient();

const SECRET_KEY: any = process.env.SECRATE_KEY || 'secret_key'

const ADMIN_ROLE = "1  ";

export async function PATCH(request: Request) {
  try {
    // Step 1: Extract and verify token
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

    // Step 2: Check if the authenticated user is an admin
    // if (decodedToken.role !== ADMIN_ROLE) {
    //   return NextResponse.json({
    //     status: 403,
    //     message: "Forbidden: You do not have permission to update users",
    //   });
    // }

    // Step 3: Parse request body and validate data
    const { id, name, email, phone, password, role } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Step 4: Update user fields
    const updatedData: any = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (phone) updatedData.phone = phone;
    if (role) updatedData.role = Number(role); // Optional: Allow role updates


    // Step 5: Update user in the database
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updatedData,
    });

    return NextResponse.json({
      status: 200,
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error in PATCH:", error);
    return NextResponse.json(
      { status: 500, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
