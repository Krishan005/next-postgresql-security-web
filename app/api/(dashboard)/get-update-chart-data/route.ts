import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma: any = new PrismaClient();

// Secret key for verifying the JWT (store securely in environment variables)
const SECRET_KEY: any = process.env.SECRATE_KEY;

export async function PUT(request: Request) {
  try {
    // Extract and verify the token
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

    // Extract request body
    const { chartId, name, data } = await request.json();

    if (!chartId) {
      return NextResponse.json({
        status: 400,
        message: "Bad Request: 'chartId' is required.",
      });
    }

    // Update the chart's name
    const updatedChart = await prisma.chart.update({
      where: { chartId : chartId },
      data: { name },
    });

    // Update chart data
    // Delete existing chart data entries for clean replacement
    await prisma.chartData.deleteMany({
      where: { chartId },
    });

    // Insert updated chart data
    const updatedChartData = await prisma.chartData.createMany({
      data: data.map((item: any) => ({
        chartId: chartId,
        NVAA: item.NVAA,
        VAA: item.VAA,
        SVAA: item.SVAA,
        UNB: item.UNB,
        TOTAL: item.TOTAL,
      })),
    });

    return NextResponse.json({
      status: 200,
      message: "Chart updated successfully",
      updatedChart,
      updatedChartData,
    });
  } catch (error: any) {
    console.error("Error in PUT:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
