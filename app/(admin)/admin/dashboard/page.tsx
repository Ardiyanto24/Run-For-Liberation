// app/(admin)/admin/dashboard/page.tsx
// Server Component — tidak ada "use client"

import prisma from "@/lib/prisma";
import KpiCard from "@/components/admin/dashboard/KpiCard";
import DistribusiChart from "@/components/admin/dashboard/DistribusiChart";
import AktivitasTerbaru from "@/components/admin/dashboard/AktivitasTerbaru";

// ── Icon components ──────────────────────────────────────────────────────────

const IconPeserta = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const IconPending = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconVerified = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const IconDana = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getDashboardData() {
  // Jalankan semua query secara paralel
  const [
    totalPeserta,
    pesertaPending,
    pesertaVerified,
    pesertaDitolak,
    sumDonasi,
    sumPendaftaran,
    pendaftaranTerbaru,
    donasiTerbaru,
    semuaPeserta,
  ] = await Promise.all([
    // KPI counts
    prisma.peserta.count(),
    prisma.peserta.count({ where: { status: "PENDING" } }),
    prisma.peserta.count({ where: { status: "VERIFIED" } }),
    prisma.peserta.count({ where: { status: "DITOLAK" } }),

    // Total donasi VERIFIED
    prisma.donasi.aggregate({
      where: { status: "VERIFIED" },
      _sum: { nominal: true },
    }),

    // Total biaya pendaftaran dari peserta VERIFIED
    prisma.pembayaran.aggregate({
      where: { peserta: { status: "VERIFIED" } },
      _sum: { biayaPendaftaran: true },
    }),

    // 8 pendaftaran terbaru
    prisma.peserta.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        namaLengkap: true,
        status: true,
        createdAt: true,
        pembayaran: { select: { totalPembayaran: true } },
      },
    }),

    // 8 donasi terbaru
    prisma.donasi.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      select: {
        namaDonatur: true,
        sembunyikanNama: true,
        nominal: true,
        status: true,
        createdAt: true,
      },
    }),

    // Semua peserta untuk chart distribusi (hanya field kategori dan tipe)
    prisma.peserta.findMany({
      select: { kategori: true, tipe: true },
    }),
  ]);

  const totalDanaTerkumpul =
    (sumDonasi._sum.nominal ?? 0) + (sumPendaftaran._sum.biayaPendaftaran ?? 0);

  // Gabungkan dan urutkan aktivitas terbaru (pendaftaran + donasi)
  type AktivitasItem = {
    nama: string;
    jenis: "Pendaftaran" | "Donasi";
    nominal: number;
    waktu: Date;
    status: "PENDING" | "VERIFIED" | "DITOLAK";
  };

  const aktivitasPendaftaran: AktivitasItem[] = pendaftaranTerbaru.map((p) => ({
    nama: p.namaLengkap,
    jenis: "Pendaftaran",
    nominal: p.pembayaran?.totalPembayaran ?? 0,
    waktu: p.createdAt,
    status: p.status as "PENDING" | "VERIFIED" | "DITOLAK",
  }));

  const aktivitasDonasi: AktivitasItem[] = donasiTerbaru.map((d) => ({
    nama: d.sembunyikanNama ? "Hamba Allah" : (d.namaDonatur ?? "Anonim"),
    jenis: "Donasi",
    nominal: d.nominal,
    waktu: d.createdAt,
    status: d.status as "PENDING" | "VERIFIED" | "DITOLAK",
  }));

  const aktivitasTerbaru = [...aktivitasPendaftaran, ...aktivitasDonasi]
    .sort((a, b) => b.waktu.getTime() - a.waktu.getTime())
    .slice(0, 8);

  return {
    totalPeserta,
    pesertaPending,
    pesertaVerified,
    pesertaDitolak,
    totalDanaTerkumpul,
    aktivitasTerbaru,
    semuaPeserta,
  };
}

// ── Page component ────────────────────────────────────────────────────────────

export const metadata = { title: "Dashboard Admin" };

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">

      {/* ── Page header ── */}
      <div>
        <h2
          className="text-2xl font-bold text-[#0A1628] leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          SELAMAT DATANG, ADMIN
        </h2>
        <p
          className="text-sm text-[#6B7A99] mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}
        >
          Berikut ringkasan kondisi event Run For Liberation 2026 saat ini.
        </p>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          title="Total Peserta"
          rawValue={data.totalPeserta}
          suffix=" orang"
          accentColor="blue"
          icon={<IconPeserta />}
        />
        <KpiCard
          title="Menunggu Verifikasi"
          rawValue={data.pesertaPending}
          suffix=" pending"
          accentColor="yellow"
          icon={<IconPending />}
        />
        <KpiCard
          title="Terverifikasi"
          rawValue={data.pesertaVerified}
          suffix=" orang"
          accentColor="green"
          icon={<IconVerified />}
        />
        <KpiCard
          title="Dana Terkumpul"
          rawValue={data.totalDanaTerkumpul}
          prefix="Rp "
          accentColor="red"
          isCurrency={true}
          icon={<IconDana />}
        />
      </div>

      {/* ── Chart Distribusi ── */}
      <DistribusiChart peserta={data.semuaPeserta} />

      {/* ── Aktivitas Terbaru ── */}
      <AktivitasTerbaru data={data.aktivitasTerbaru} />

    </div>
  );
}