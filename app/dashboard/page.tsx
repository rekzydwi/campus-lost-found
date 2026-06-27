import { auth } from "@/auth";
import { signOut } from "@/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Item from "@/models/Item";
import Link from "next/link";

interface Item {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: "hilang" | "ditemukan";
  location: string;
  image: string;
  userId: string;
  createdAt: Date;
}

async function getItems(userId: string) {
  await connectToDatabase();
  const items = await Item.find({ userId }).sort({ createdAt: -1 }).lean();
  return items;
}

export default async function DashboardPage() {
  const session = await auth();
  const items = await getItems(session?.user?.id as string);

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
              {items.length} laporan ditemukan
            </p>
          </div>
          <Link
            href="/dashboard/items/create"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            + Buat Laporan
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-4xl mb-4">📋</p>
            <p className="font-semibold text-slate-900">Belum ada laporan</p>
            <p className="text-slate-500 mt-1 text-sm">
              Buat laporan pertama kamu dengan klik tombol di atas
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <ItemCard key={String(item._id)} item={item as unknown as Item} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function ItemCard({ item }: { item: Item }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
          {item.status === "hilang" ? "🔍" : "✅"}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-slate-900">{item.title}</p>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                item.status === "hilang"
                  ? "bg-red-50 text-red-600"
                  : "bg-green-50 text-green-600"
              }`}
            >
              {item.status === "hilang" ? "Hilang" : "Ditemukan"}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {item.category} • {item.location}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/dashboard/items/${item._id.toString()}/edit`}
          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 transition"
        >
          Edit
        </Link>
        <DeleteButton id={item._id.toString()} />
      </div>
    </div>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        "use server";
        const { connectToDatabase } = await import("@/lib/mongodb");
        const Item = (await import("@/models/Item")).default;
        const { revalidatePath } = await import("next/cache");
        await connectToDatabase();
        await Item.findByIdAndDelete(id);
        revalidatePath("/dashboard");
      }}
    >
      <button
        type="submit"
        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
      >
        Hapus
      </button>
    </form>
  );
}