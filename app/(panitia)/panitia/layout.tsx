// app/(panitia)/panitia/layout.tsx

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal Panitia — Run For Liberation 2026",
};

export default function PanitiaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}