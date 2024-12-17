import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma: any = new PrismaClient();

const SECRET_KEY: any = process.env.SECRATE_KEY || 'secret_key';

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
    let decodedToken: any;

    try {
      decodedToken = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      return NextResponse.json({
        status: 401,
        message: "Unauthorized: Invalid token",
      });
    }

  const url = new URL(request.url);
      const id = request.url.split("/").pop()
      
      console.log("ID:", id);

    if (!id) {
      return NextResponse.json({
        status: 400,
        message: "Bad Request: 'id' parameter is required",
      });
    }

      const chart = await prisma.Chart.findUnique({
        where: { chartId: id },
    
      })
    const chartData = await prisma.ChartData.findMany({
      where: { chartId: id },
    });

    return NextResponse.json({
      status: 200,
      message: "Chart data fetched successfully",
        chartData,
      chart
    });
  } catch (error: any) {
    console.error("Error fetching chart data:", error);

    return NextResponse.json({
      status: 500,
      message: "Failed to fetch chart data",
      error: error.message,
    });
  }
}
