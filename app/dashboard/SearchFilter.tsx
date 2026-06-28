"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface SearchFilterProps {
  currentStatus?: string;
  currentSearch?: string;
}

export default function SearchFilter({
  currentStatus,
  currentSearch,
}: SearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "semua") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`/dashboard?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Cari judul laporan..."
        defaultValue={currentSearch}
        onChange={(e) => {
          const value = e.target.value;
          const timeout = setTimeout(() => {
            updateParams("search", value);
          }, 500);
          return () => clearTimeout(timeout);
        }}
        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 bg-white"
      />

      {/* Filter Status */}
      <div className="flex gap-2">
        {["semua", "hilang", "ditemukan"].map((s) => (
          <button
            key={s}
            onClick={() => updateParams("status", s)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition capitalize ${
              (!currentStatus && s === "semua") || currentStatus === s
                ? "bg-indigo-600 text-white"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "semua" ? "Semua" : s === "hilang" ? "Hilang" : "Ditemukan"}
          </button>
        ))}
      </div>
    </div>
  );
}