// app/(panitia)/panitia/layout.tsx

import type { Metadata } from "next";
import PanitiaShell from "@/components/panitia/PanitiaShell";

export const metadata: Metadata = {
  title: "Portal Panitia — Run For Liberation 2026",
};

export default function PanitiaLayout({ children }: { children: React.ReactNode }) {
  return <PanitiaShell>{children}</PanitiaShell>;
}