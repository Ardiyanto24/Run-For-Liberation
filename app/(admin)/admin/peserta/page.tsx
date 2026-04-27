// app/(admin)/admin/peserta/page.tsx
// Server Component — tidak ada "use client"

import prisma from "@/lib/prisma";
import PesertaClientShell from "../../../../components/admin/peserta/PesertaClientShell";
import { KategoriLomba, StatusPeserta, TipePendaftaran } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getPesertaData(params: {
  status?: string;
  kategori?: string;
  tipe?: string;
  search?: string;
}) {
  const where: {
    status?: StatusPeserta;
    kategori?: { in: KategoriLomba[] };
    tipe?: TipePendaftaran;
    OR?: Array<{
      namaLengkap?: { contains: string; mode: "insensitive" };
      email?: { contains: string; mode: "insensitive" };
    }>;
  } = {};

  // Filter status
  if (params.status && ["PENDING", "VERIFIED", "DITOLAK"].includes(params.status)) {
    where.status = params.status as StatusPeserta;
  }

  // Filter kategori (FUN_RUN → dua varian, FUN_WALK → dua varian)
  if (params.kategori === "FUN_RUN") {
    where.kategori = { in: ["FUN_RUN_GAZA", "FUN_RUN_RAFAH"] };
  } else if (params.kategori === "FUN_WALK") {
    where.kategori = { in: ["FUN_WALK_GAZA", "FUN_WALK_RAFAH"] };
  }

  // Filter tipe
  if (params.tipe === "INDIVIDU") where.tipe = "INDIVIDU";
  if (params.tipe === "KELUARGA") where.tipe = "KELUARGA";

  // Search: nama atau email (case-insensitive)
  if (params.search && params.search.trim() !== "") {
    where.OR = [
      { namaLengkap: { contains: params.search.trim(), mode: "insensitive" } },
      { email: { contains: params.search.trim(), mode: "insensitive" } },
    ];
  }

  const [pesertaList, counts] = await Promise.all([
    prisma.peserta.findMany({
      where,
      include: {
        pembayaran: true,
        anggota: { orderBy: { urutan: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    // Counts per status (tanpa filter lain) untuk badge toolbar
    Promise.all([
      prisma.peserta.count(),
      prisma.peserta.count({ where: { status: "PENDING" } }),
      prisma.peserta.count({ where: { status: "VERIFIED" } }),
      prisma.peserta.count({ where: { status: "DITOLAK" } }),
    ]),
  ]);

  return {
    pesertaList,
    counts: {
      semua: counts[0],
      pending: counts[1],
      verified: counts[2],
      ditolak: counts[3],
    },
  };
}

export const metadata = { title: "Manajemen Peserta" };

export default async function PesertaPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const status = typeof params.status === "string" ? params.status : undefined;
  const kategori = typeof params.kategori === "string" ? params.kategori : undefined;
  const tipe = typeof params.tipe === "string" ? params.tipe : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  const { pesertaList, counts } = await getPesertaData({ status, kategori, tipe, search });

  return (
    <PesertaClientShell
      pesertaList={pesertaList}
      counts={counts}
      activeStatus={status ?? "SEMUA"}
      activeKategori={kategori ?? "SEMUA"}
      activeTipe={tipe ?? "SEMUA"}
      activeSearch={search ?? ""}
    />
  );
}