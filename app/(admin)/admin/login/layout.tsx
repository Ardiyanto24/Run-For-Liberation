// Layout khusus login — mengisolasi halaman login dari admin layout (sidebar + header)
// Hanya meneruskan children tanpa wrapper apapun
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}