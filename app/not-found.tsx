import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-indigo-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-slate-500 mb-8">
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Ke Dashboard
          </Link>
          <Link
            href="/laporan"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Semua Laporan
          </Link>
        </div>
      </div>
    </main>
  );
}