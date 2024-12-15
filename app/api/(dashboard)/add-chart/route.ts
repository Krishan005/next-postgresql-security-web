import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma: any = new PrismaClient();


const SECRET_KEY: any = process.env.SECRATE_KEY || 'secret_key';

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

    
      const { name, data } = await request.json();

   
      
      var chartId = `${Date.now()}`;

    const chart: any = await prisma.chart.create({
      data: {
        name,
        chartId: chartId,
      },
    });


    const chartData: any = await prisma.chartData.createMany({
      data: data.map((item: any) => ({
        chartId: chartId,
        NVAA: item.NVAA,
        VAA: item.VAA,
        SVAA: item.SVAA,
        UNB: item.UNB,
        TOTAL: String(item.TOTAL),
      })),
    });
      
  
      

    return NextResponse.json({
      chart,
      chartData,
      status: 200,
      message: "Chart created successfully",
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({
      status: 500,
      message: "Internal Server Error",
    });
  }
}
