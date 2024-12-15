import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma: any = new PrismaClient();

// Secret key for verifying the JWT (should be stored in an environment variable)
const SECRET_KEY: any = process.env.SECRATE_KEY || 'secret_key';

export async function GET(request: Request) {
  try {
    // Extract the token from the Authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    let decodedToken: any;
    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized: Invalid token",
      });
    }

    // Token is valid; proceed to fetch charts
      const charts = await prisma.chart.findMany({
      orderBy: {
        "createAt": "desc", // Sort charts by createdAt in descending order
      },
    });

    return NextResponse.json({
      status: 200,
      message: "Charts fetched successfully",
      charts,
    });
  } catch (error) {
    console.error("Error fetching charts:", error);

    return NextResponse.json({
      status: 500,
      message: "Error fetching charts",
      error,
    });
  }
}
