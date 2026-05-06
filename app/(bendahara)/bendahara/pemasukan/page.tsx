// app/(bendahara)/bendahara/pemasukan/page.tsx

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import RingkasanPemasukan from "@/components/bendahara/pemasukan/RingkasanPemasukan";
import FormPemasukan from "@/components/bendahara/pemasukan/FormPemasukan";
import {
  getRingkasanPemasukan,
  getPemasukanManual,
  type RingkasanPemasukan as RingkasanType,
  type PemasukanManualRecord,
} from "@/actions/bendahara";
import { useEffect } from "react";

export default function PemasukanPage() {
  const router = useRouter();
  const [ringkasan, setRingkasan] = useState<RingkasanType | null>(null);
  const [riwayat,   setRiwayat]   = useState<PemasukanManualRecord[]>([]);
  const [loading,   setLoading]   = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [r, rw] = await Promise.all([
      getRingkasanPemasukan(),
      getPemasukanManual(),
    ]);
    setRingkasan(r);
    setRiwayat(rw);
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
          Pemasukan
        </h1>
        <p className="text-sm text-[#6B7A99] mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Ringkasan seluruh pemasukan event dari semua sumber
        </p>
      </div>

      {/* Ringkasan KPI */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white animate-pulse"
              style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }} />
          ))}
        </div>
      ) : ringkasan ? (
        <RingkasanPemasukan data={ringkasan} />
      ) : null}

      {/* Form & Riwayat */}
      {!loading && (
        <FormPemasukan riwayat={riwayat} onSuccess={handleSuccess} />
      )}
    </div>
  );
}