import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Campus Lost & Found API is running.",
    timestamp: new Date().toISOString(),
  });
}