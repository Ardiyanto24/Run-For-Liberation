// app/(bendahara)/bendahara/pengeluaran/page.tsx

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import FormPengeluaran from "@/components/bendahara/pengeluaran/FormPengeluaran";
import TabelPengeluaran from "@/components/bendahara/pengeluaran/TabelPengeluaran";
import {
  getPengeluaran,
  type PengeluaranRecord,
  type RingkasanPengeluaran,
} from "@/actions/bendahara";

export default function PengeluaranPage() {
  const router = useRouter();
  const [list,      setList]      = useState<PengeluaranRecord[]>([]);
  const [ringkasan, setRingkasan] = useState<RingkasanPengeluaran | null>(null);
  const [loading,   setLoading]   = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const result = await getPengeluaran();
    setList(result.list);
    setRingkasan(result.ringkasan);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSuccess = () => {
    fetchData();
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl text-[#0A1628] leading-none tracking-wide"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Pengeluaran
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Pencatatan seluruh pengeluaran event beserta nota pendukung
        </p>
      </div>

      {/* Form Input */}
      <FormPengeluaran onSuccess={handleSuccess} />

      {/* Tabel + Ringkasan */}
      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white animate-pulse"
                style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }} />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-white animate-pulse"
            style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }} />
        </div>
      ) : ringkasan ? (
        <TabelPengeluaran
          list={list}
          ringkasan={ringkasan}
          onSuccess={handleSuccess}
        />
      ) : null}
    </div>
  );
}