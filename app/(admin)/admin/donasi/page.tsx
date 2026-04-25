// app/(admin)/admin/donasi/page.tsx

"use client";

import { useState, useMemo } from "react";
import { dummyDonasi } from "@/lib/placeholder-data";
import KpiDonasi from "@/components/admin/donasi/KpiDonasi";
import TabelDonasi from "@/components/admin/donasi/TabelDonasi";
import ModalDetailDonasi from "@/components/admin/donasi/ModalDetailDonasi";

type StatusFilter = "SEMUA" | "PENDING" | "VERIFIED" | "DITOLAK";
type StatusDonasi = "PENDING" | "VERIFIED" | "DITOLAK";

interface Donasi {
  id: string;
  namaDonatur: string | null;
  sembunyikanNama: boolean;
  emailDonatur: string | null;
  pesan: string | null;
  nominal: number;
  metodePembayaran: string;
  buktiBayarUrl: string | null;
  buktiBayarNama: string | null;
  status: StatusDonasi;
  catatanAdmin: string | null;
  createdAt: Date;
}

// Target donasi — nanti dari environment variable di DEV-10
const TARGET_DONASI = 5_000_000;

export default function DonasiPage() {
  const [donasiList, setDonasiList] = useState<Donasi[]>(
    dummyDonasi as Donasi[]
  );
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("SEMUA");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDonasi, setSelectedDonasi] = useState<Donasi | null>(null);

  // ── KPI values ──
  const kpi = useMemo(() => {
    const verified = donasiList.filter((d) => d.status === "VERIFIED");
    const totalTerkumpul = verified.reduce((sum, d) => sum + d.nominal, 0);
    const jumlahDonatur = donasiList.length;
    const rataRata =
      verified.length > 0 ? Math.round(totalTerkumpul / verified.length) : 0;
    return { totalTerkumpul, jumlahDonatur, rataRata };
  }, [donasiList]);

  // ── Count per status ──
  const counts = useMemo(() => ({
    semua:    donasiList.length,
    pending:  donasiList.filter((d) => d.status === "PENDING").length,
    verified: donasiList.filter((d) => d.status === "VERIFIED").length,
    ditolak:  donasiList.filter((d) => d.status === "DITOLAK").length,
  }), [donasiList]);

  // ── Filter + Search ──
  const filteredDonasi = useMemo(() => {
    let result = donasiList;

    if (activeFilter !== "SEMUA") {
      result = result.filter((d) => d.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((d) => {
        const nama = d.sembunyikanNama
          ? "hamba allah"
          : (d.namaDonatur ?? "").toLowerCase();
        const email = (d.emailDonatur ?? "").toLowerCase();
        return nama.includes(q) || email.includes(q);
      });
    }

    return result;
  }, [donasiList, activeFilter, searchQuery]);

  // ── Handler Verify ──
  const handleVerify = (id: string) => {
    setDonasiList((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "VERIFIED" as StatusDonasi, catatanAdmin: null }
          : d
      )
    );
    if (selectedDonasi?.id === id) {
      setSelectedDonasi((prev) =>
        prev ? { ...prev, status: "VERIFIED" } : null
      );
    }
  };

  // ── Handler Tolak ──
  const handleTolak = (id: string, catatan: string) => {
    setDonasiList((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, status: "DITOLAK" as StatusDonasi, catatanAdmin: catatan }
          : d
      )
    );
    setSelectedDonasi(null);
  };

  const FILTER_TABS: { key: StatusFilter; label: string; count: number }[] = [
    { key: "SEMUA",    label: "Semua",    count: counts.semua    },
    { key: "PENDING",  label: "Pending",  count: counts.pending  },
    { key: "VERIFIED", label: "Verified", count: counts.verified },
    { key: "DITOLAK",  label: "Ditolak",  count: counts.ditolak  },
  ];

  const TAB_ACTIVE: Record<StatusFilter, string> = {
    SEMUA:    "bg-[#1A54C8] text-white border-[#1A54C8]",
    PENDING:  "bg-[rgba(217,119,6,0.12)] text-[#D97706] border-[#D97706]",
    VERIFIED: "bg-[rgba(0,122,61,0.1)] text-[#007A3D] border-[#007A3D]",
    DITOLAK:  "bg-[rgba(206,17,38,0.1)] text-[#CE1126] border-[#CE1126]",
  };

  return (
    <div className="space-y-4">
      {/* Page header */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          MANAJEMEN DONASI
        </h2>
        <p
          className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Total {counts.semua} donatur ·{" "}
          <span className="text-[#D97706] font-medium">
            {counts.pending} menunggu verifikasi
          </span>
        </p>
      </div>

      {/* KPI Donasi */}
      <KpiDonasi
        totalTerkumpul={kpi.totalTerkumpul}
        jumlahDonatur={kpi.jumlahDonatur}
        rataRata={kpi.rataRata}
        target={TARGET_DONASI}
      />

      {/* Toolbar filter + search */}
      <div
        className="bg-white rounded-2xl p-4 space-y-3"
        style={{ boxShadow: "0 2px 16px rgba(10,22,40,0.07)" }}
      >
        {/* Filter tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150",
                activeFilter === tab.key
                  ? TAB_ACTIVE[tab.key]
                  : "bg-[#F5F8FF] text-[#6B7A99] border-[rgba(26,84,200,0.13)] hover:border-[#1A54C8] hover:text-[#1A54C8]",
              ].join(" ")}
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {tab.label}
              <span
                className={[
                  "inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold",
                  activeFilter === tab.key
                    ? "bg-white/30 text-inherit"
                    : "bg-[rgba(26,84,200,0.08)] text-[#6B7A99]",
                ].join(" ")}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7A99] pointer-events-none"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau email donatur..."
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-[rgba(26,84,200,0.2)] text-sm text-[#0A1628] placeholder-[#6B7A99]/60 outline-none transition-all focus:border-[#1A54C8] focus:ring-2 focus:ring-[rgba(26,84,200,0.12)] bg-[#F5F8FF]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7A99] hover:text-[#0A1628] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Info hasil filter */}
      {(activeFilter !== "SEMUA" || searchQuery) && (
        <div className="flex items-center justify-between">
          <p
            className="text-xs text-[#6B7A99]"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Menampilkan{" "}
            <span className="font-semibold text-[#0A1628]">
              {filteredDonasi.length}
            </span>{" "}
            dari {counts.semua} donasi
          </p>
          <button
            onClick={() => {
              setActiveFilter("SEMUA");
              setSearchQuery("");
            }}
            className="text-xs text-[#1A54C8] hover:underline"
            style={{ fontFamily: "'Barlow', sans-serif" }}
          >
            Reset filter
          </button>
        </div>
      )}

      {/* Tabel Donasi */}
      <TabelDonasi
        donasi={filteredDonasi}
        onOpenModal={setSelectedDonasi}
        onVerify={handleVerify}
      />

      {/* Modal Detail Donasi */}
      <ModalDetailDonasi
        donasi={selectedDonasi}
        onClose={() => setSelectedDonasi(null)}
        onVerify={handleVerify}
        onTolak={handleTolak}
      />
    </div>
  );
}