// app/(bendahara)/bendahara/dashboard/page.tsx

export default function BendaharaDashboardPage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide">
        Dashboard Bendahara
      </h1>
      <p className="font-['Barlow'] text-sm text-[#6B7A99]">
        Selamat datang di portal bendahara Run For Liberation 2026.
      </p>
      <div className="mt-6 rounded-2xl border border-dashed border-[rgba(26,84,200,0.2)] bg-white p-12 text-center">
        <p className="font-['Barlow_Condensed'] text-[#6B7A99] text-sm uppercase tracking-widest">
          Dashboard dalam pengerjaan
        </p>
      </div>
    </div>
  );
}