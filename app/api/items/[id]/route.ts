import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

// GET — tetap sama seperti sebelumnya
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const item = await Item.findOne({ _id: id, userId: session.user.id });

    if (!item) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ item });
  } catch (error) {
    console.error("GET item error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// PUT — update dengan hapus foto lama jika ada foto baru
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, category, status, location, image, imagePublicId } = body;

    if (!title || !description || !category || !status || !location) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Kalau ada foto baru, hapus foto lama dari Cloudinary
    if (imagePublicId) {
      const oldItem = await Item.findOne({ _id: id, userId: session.user.id });
      if (oldItem?.imagePublicId) {
        await cloudinary.uploader.destroy(oldItem.imagePublicId);
      }
    }

    const item = await Item.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, description, category, status, location, image, imagePublicId },
      { new: true }
    );

    if (!item) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Laporan berhasil diperbarui", item });
  } catch (error) {
    console.error("PUT item error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// DELETE — hapus laporan beserta fotonya
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu" },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const item = await Item.findOne({ _id: id, userId: session.user.id });

    if (!item) {
      return NextResponse.json(
        { message: "Laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hapus foto dari Cloudinary kalau ada
    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await Item.findByIdAndDelete(id);

    return NextResponse.json({ message: "Laporan berhasil dihapus" });
  } catch (error) {
    console.error("DELETE item error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}