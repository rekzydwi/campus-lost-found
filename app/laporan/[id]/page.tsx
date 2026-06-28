import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getItem(id: string) {
  await connectToDatabase();
  const item = await Item.findById(id).lean();
  if (!item) return null;

  const user = await User.findById(item.userId).lean();
  return {
    ...item,
    userName: (user as { name?: string } | null)?.name || "Pengguna",
  };
}

export default async function DetailLaporanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  const { id } = await params;
  const item = await getItem(id);

  if (!item) notFound();

  const isOwner = String(item.userId) === session?.user?.id;

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/laporan"
              className="text-slate-500 hover:text-slate-700 transition"
            >
              ← Kembali
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white text-xs">
                CLF
              </div>
              <p className="font-bold text-slate-900">Campus Lost & Found</p>
            </div>
          </div>

          {isOwner && (
            <Link
              href={`/dashboard/items/${id}/edit`}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
            >
              Edit Laporan
            </Link>
          )}
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* Foto Barang */}
          {item.image ? (
            <div className="relative w-full h-72">
              <Image
                src={item.image as string}
                alt={item.title as string}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-6xl">
              {item.status === "hilang" ? "🔍" : "✅"}
            </div>
          )}

          <div className="p-8">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "hilang"
                        ? "bg-red-50 text-red-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {item.status === "hilang" ? "🔍 Hilang" : "✅ Ditemukan"}
                  </span>
                  {isOwner && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-600">
                      Laporan Saya
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {item.title as string}
                </h1>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Kategori</p>
                <p className="font-semibold text-slate-900">{item.category as string}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Lokasi</p>
                <p className="font-semibold text-slate-900">{item.location as string}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Dilaporkan oleh</p>
                <p className="font-semibold text-slate-900">{item.userName}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-1">Tanggal</p>
                <p className="font-semibold text-slate-900">
                  {new Date(item.createdAt as Date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Deskripsi */}
            <div className="mb-6">
              <p className="text-xs text-slate-500 mb-2">Deskripsi</p>
              <p className="text-slate-700 leading-7 bg-slate-50 rounded-xl p-4">
                {item.description as string}
              </p>
            </div>

            {/* Tombol Aksi */}
            <div className="flex gap-3">
              <Link
                href="/laporan"
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-center hover:bg-slate-50 transition"
              >
                ← Kembali ke Daftar
              </Link>
              {!isOwner && (
                <Link
                  href="/dashboard"
                  className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-center hover:bg-indigo-700 transition"
                >
                  Laporkan Milikku
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}