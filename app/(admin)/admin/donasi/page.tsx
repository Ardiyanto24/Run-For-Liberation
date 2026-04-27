// app/(admin)/admin/donasi/page.tsx
// Server Component

import prisma from "@/lib/prisma";
import DonasiClientShell from "../../../../components/admin/donasi/DonasiClientShell";
import { StatusPembayaran } from "@prisma/client";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getDonasiData(params: { status?: string; search?: string }) {
  const where: {
    status?: StatusPembayaran;
    OR?: Array<{
      namaDonatur?: { contains: string; mode: "insensitive" };
      emailDonatur?: { contains: string; mode: "insensitive" };
    }>;
  } = {};

  if (params.status && ["PENDING", "VERIFIED", "DITOLAK"].includes(params.status)) {
    where.status = params.status as StatusPembayaran;
  }

  if (params.search && params.search.trim() !== "") {
    where.OR = [
      { namaDonatur: { contains: params.search.trim(), mode: "insensitive" } },
      { emailDonatur: { contains: params.search.trim(), mode: "insensitive" } },
    ];
  }

  const [donasiList, totalDonasi, totalVerified] = await Promise.all([
    prisma.donasi.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.donasi.count(),
    prisma.donasi.aggregate({
      where: { status: "VERIFIED" },
      _sum: { nominal: true },
    }),
  ]);

  return {
    donasiList,
    stats: {
      totalDonatur: totalDonasi,
      totalTerkumpul: totalVerified._sum.nominal ?? 0,
    },
  };
}

export const metadata = { title: "Manajemen Donasi" };

export default async function DonasiPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = typeof params.status === "string" ? params.status : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;

  const { donasiList, stats } = await getDonasiData({ status, search });

  return (
    <DonasiClientShell
      donasiList={donasiList}
      stats={stats}
      activeStatus={status ?? "SEMUA"}
      activeSearch={search ?? ""}
    />
  );
}