"use client";

import { useState } from "react";
import Toast from "@/app/components/Toast";

interface DeleteButtonProps {
  id: string;
}

export default function DeleteButton({ id }: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus laporan ini? Tindakan ini tidak bisa dibatalkan."
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setToast({ message: "Laporan berhasil dihapus!", type: "success" });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setToast({ message: "Gagal menghapus laporan.", type: "error" });
      }
    } catch {
      setToast({ message: "Terjadi kesalahan.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition disabled:opacity-50"
      >
        {loading ? "Menghapus..." : "Hapus"}
      </button>
    </>
  );
}