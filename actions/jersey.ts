// actions/jersey.ts

import stokData from "@/data/stok-jersey.json";

const UKURAN_URUTAN = ["SS", "S", "M", "L", "XL", "XXL", "XXXL"] as const;
export type UkuranJersey = (typeof UKURAN_URUTAN)[number];
export type UkuranLengan = "PENDEK" | "PANJANG";

export type StokJerseyItem = {
  ukuran: UkuranJersey;
  lengan: UkuranLengan;
  stokTotal: number;
  stokDipesan: number;
  stokTersedia: number;
};

export function getStokJersey(): StokJerseyItem[] {
  return stokData.stok.map((item) => ({
    ukuran: item.ukuran as UkuranJersey,
    lengan: item.lengan as UkuranLengan,
    stokTotal: item.stok_total,
    stokDipesan: item.stok_dipesan,
    stokTersedia: Math.max(0, item.stok_total - item.stok_dipesan),
  }));
}

export { UKURAN_URUTAN };