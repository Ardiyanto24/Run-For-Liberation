// components/public/beranda/DonasiSectionWrapper.tsx

import { getStatistikDonasi } from "@/lib/queries/donasi";
import DonasiSection from "./DonasiSection";

export default async function DonasiSectionWrapper() {
  const { totalTerkumpul, jumlahDonatur, jumlahPeserta, targetDonasi, persentase } =
    await getStatistikDonasi();

  return (
    <DonasiSection
      totalTerkumpul={totalTerkumpul}
      jumlahDonatur={jumlahDonatur}
      jumlahPeserta={jumlahPeserta}
      targetDonasi={targetDonasi}
      persentase={persentase}
    />
  );
}