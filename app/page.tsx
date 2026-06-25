import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 font-bold text-white text-xl mx-auto mb-6">
          CLF
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Campus Lost & Found
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Platform pelaporan barang hilang dan temuan di lingkungan kampus.
          Bantu sesama mahasiswa menemukan barang mereka kembali.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition"
          >
            Daftar
          </Link>
        </div>
      </div>
    </main>
  );
}