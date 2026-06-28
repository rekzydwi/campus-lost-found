import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import User from "@/models/User";
import Link from "next/link";
import Image from "next/image";
import PublicSearchFilter from "./PublicSearchFilter";

interface ItemData {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "hilang" | "ditemukan";
  location: string;
  image: string;
  imagePublicId: string;
  userId: string;
  createdAt: Date;
  userName?: string;
}

async function getAllItems() {
  await connectToDatabase();
  const items = await Item.find({})
    .sort({ createdAt: -1 })
    .lean();

  // Ambil nama user untuk setiap laporan
  const itemsWithUser = await Promise.all(
    items.map(async (item) => {
      const user = await User.findById(item.userId).lean();
      return {
        ...item,
        userName: (user as { name?: string } | null)?.name || "Pengguna",
      };
    })
  );

  return itemsWithUser;
}

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>;
}) {
  const session = await auth();
  const allItems = await getAllItems();
  const { status, search } = await searchParams;

  const filteredItems = allItems.filter((item) => {
    const matchStatus = !status || status === "semua" || item.status === status;
    const matchSearch =
      !search ||
      item.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const hilangCount = allItems.filter((i) => i.status === "hilang").length;
  const ditemukanCount = allItems.filter((i) => i.status === "ditemukan").length;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              CLF
            </div>
            <div>
              <p className="font-bold text-slate-900">Campus Lost & Found</p>
              <p className="text-xs text-slate-500">Semua Laporan</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
            >
              Dashboard Saya
            </Link>
            <Link
              href="/dashboard/items/create"
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
            >
              + Buat Laporan
            </Link>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        {/* Statistik */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 text-center">
            <p className="text-3xl font-bold text-slate-900">{allItems.length}</p>
            <p className="text-sm text-slate-500 mt-1">Total Laporan</p>
          </div>
          <div className="bg-white rounded-2xl border border-red-100 p-5 text-center">
            <p className="text-3xl font-bold text-red-500">{hilangCount}</p>
            <p className="text-sm text-slate-500 mt-1">Barang Hilang</p>
          </div>
          <div className="bg-white rounded-2xl border border-green-100 p-5 text-center">
            <p className="text-3xl font-bold text-green-500">{ditemukanCount}</p>
            <p className="text-sm text-slate-500 mt-1">Barang Ditemukan</p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Semua Laporan</h1>
          <p className="text-slate-500 mt-1">
            {filteredItems.length} laporan ditemukan dari seluruh pengguna
          </p>
        </div>

        {/* Search & Filter */}
        <PublicSearchFilter currentStatus={status} currentSearch={search} />

        {/* Daftar Laporan */}
        <div className="mt-6">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <p className="text-4xl mb-4">📋</p>
              <p className="font-semibold text-slate-900">
                {allItems.length === 0
                  ? "Belum ada laporan"
                  : "Tidak ada laporan yang cocok"}
              </p>
              <p className="text-slate-500 mt-1 text-sm">
                {allItems.length === 0
                  ? "Jadilah yang pertama membuat laporan"
                  : "Coba ubah filter atau kata pencarian"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <PublicItemCard
                  key={String(item._id)}
                  item={item as unknown as ItemData}
                  currentUserId={session?.user?.id || ""}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function PublicItemCard({
  item,
  currentUserId,
}: {
  item: ItemData;
  currentUserId: string;
}) {
  const isOwner = String(item.userId) === currentUserId;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        {item.image ? (
          <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
            {item.status === "hilang" ? "🔍" : "✅"}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/laporan/${String(item._id)}`}
              className="font-semibold text-slate-900 hover:text-indigo-600 transition"
            >
              {item.title}
            </Link>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === "hilang"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
                }`}
            >
              {item.status === "hilang" ? "Hilang" : "Ditemukan"}
            </span>
            {isOwner && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
                Laporan Saya
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {item.category} • {item.location}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Dilaporkan oleh <strong>{item.userName}</strong> •{" "}
            {new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Hanya pemilik yang bisa edit/hapus */}
      {isOwner && (
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/items/${String(item._id)}/edit`}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
          >
            Edit
          </Link>
        </div>
      )}
    </div>
  );
}