// app/(public)/daftar/page.tsx
// ⚠️ PENDAFTARAN DITUTUP SEMENTARA
// Untuk membuka kembali: hapus redirect dan uncomment baris DaftarForm

import { redirect } from "next/navigation";

export default function DaftarPage() {
  // Uncomment baris di bawah dan hapus redirect() untuk membuka pendaftaran kembali
  // return <DaftarForm />;
  redirect("/daftar/tutup");
}