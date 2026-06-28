import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";

export const runtime = "nodejs";

// Satu fungsi GET yang menangani dua kasus
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const all = searchParams.get("all");

    const items =
      all === "true"
        ? await Item.find({}).sort({ createdAt: -1 }).lean()
        : await Item.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .lean();

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET items error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description, category, status, location, image, imagePublicId } = body;

    if (!title || !description || !category || !status || !location) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const item = await Item.create({
      title,
      description,
      category,
      status,
      location,
      image: image || "",
      imagePublicId: imagePublicId || "",
      userId: session.user.id,
    });

    return NextResponse.json(
      { message: "Laporan berhasil dibuat", item },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST item error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}