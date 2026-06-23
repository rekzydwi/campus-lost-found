import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();

    return NextResponse.json({
      status: "ok",
      message: "MongoDB Atlas berhasil terhubung.",
      database: mongoose.connection.name,
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);

    return NextResponse.json(
      {
        status: "error",
        message: "MongoDB Atlas gagal terhubung.",
      },
      { status: 500 }
    );
  }
}