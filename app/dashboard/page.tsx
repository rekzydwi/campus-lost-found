import { auth } from "@/auth";
import { signOut } from "@/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
              CLF
            </div>
            <div>
              <p className="font-bold text-slate-900">Campus Lost & Found</p>
              <p className="text-xs text-slate-500">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">
              Halo, <strong>{session?.user?.name}</strong>
            </span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
              >
                Keluar
              </button>
            </form>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Laporan Barang
            </h1>
            <p className="text-slate-500 mt-1">
              Kelola laporan barang hilang dan temuan
            </p>
          </div>
          <Link
            href="/dashboard/items/create"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            + Buat Laporan
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-4xl mb-4">📋</p>
          <p className="font-semibold text-slate-900">Belum ada laporan</p>
          <p className="text-slate-500 mt-1 text-sm">
            Buat laporan pertama kamu dengan klik tombol di atas
          </p>
        </div>
      </section>
    </main>
  );
}