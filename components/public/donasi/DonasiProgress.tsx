// components/public/donasi/DonasiProgress/tsx

// Server Component — tidak perlu 'use client'

import { formatRupiah } from '@/lib/utils';

interface DonasiProgressProps {
  totalTerkumpul: number;
  jumlahDonatur: number;
  targetDonasi: number;
  persentase: number;
}

export function DonasiProgress({
  totalTerkumpul,
  jumlahDonatur,
  targetDonasi,
  persentase,
}: DonasiProgressProps) {
  // Clamp persentase agar tidak melebihi 100%
  const pct = Math.min(Math.max(persentase, 0), 100);

  return (
    <div>
      {/* ── 4 Stat Cards (grid 2×2) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px', // Jarak antar card sedikit dilebarkan
        }}
      >
        {/* Terkumpul */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0', // Border tegas
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', // Bayangan agar card timbul
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '6px',
              color: '#16A34A', // Hijau solid
              letterSpacing: '1px',
            }}
          >
            {formatRupiah(totalTerkumpul)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Terkumpul
          </span>
        </div>

        {/* Total Donatur */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '6px',
              color: '#DC2626', // Merah solid
              letterSpacing: '1px',
            }}
          >
            {jumlahDonatur.toLocaleString('id-ID')}
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Total Donatur
          </span>
        </div>

        {/* Target */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '6px',
              color: '#2563EB', // Biru solid
              letterSpacing: '1px',
            }}
          >
            {formatRupiah(targetDonasi)}
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Target
          </span>
        </div>

        {/* Tercapai % */}
        <div
          style={{
            background: '#ffffff',
            border: '1.5px solid #E2E8F0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
            borderRadius: '12px',
            padding: '20px 16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '6px',
              color: '#0F172A', // Hitam/Navy gelap agar kontras
              letterSpacing: '1px',
            }}
          >
            {pct}%
          </span>
          <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tercapai
          </span>
        </div>
      </div>

      {/* ── Progress Bar Box ── */}
      <div
        style={{
          background: '#F8FAFC', // Abu-abu sangat muda
          borderRadius: '16px',
          padding: '28px',
          marginTop: '24px',
          marginBottom: '20px',
          border: '1.5px solid #CBD5E1', // Border lebih tebal sedikit untuk membedakan dari grid
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', // Inner shadow agar terasa seperti "wadah"
        }}
      >
        {/* Top: nominal terkumpul + label target */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '14px',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '38px', // Diperbesar sedikit
              color: '#16A34A',
              letterSpacing: '1px',
              lineHeight: 1,
            }}
          >
            {formatRupiah(totalTerkumpul)}
          </span>
          <span
            style={{
              fontSize: '14px',
              color: '#64748B',
              fontWeight: 500,
              paddingBottom: '4px',
            }}
          >
            Target: {formatRupiah(targetDonasi)}
          </span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: '14px', // Dibuat lebih tebal agar lebih memuaskan dilihat
            background: '#E2E8F0',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '12px',
          }}
        >
          {/* Progress Fill */}
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, #16A34A, #4ADE80)', // Gradien hijau cantik
              borderRadius: '999px',
              transition: 'width 1.8s ease',
            }}
          />
        </div>

        {/* Meta text */}
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0, fontWeight: 500 }}>
          <span style={{ color: '#16A34A', fontWeight: 800 }}>
            {pct}%
          </span>{' '}
          dari target &bull; Real-time
        </p>
      </div>

      {/* ── Live Update Pill ── */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#DCFCE7', // Hijau sangat muda
          border: '1px solid #BBF7D0',
          borderRadius: '8px', // Sedikit disesuaikan agar cocok dengan style modern
          padding: '10px 16px',
          fontSize: '13px',
          color: '#16A34A',
          fontWeight: 700,
        }}
      >
        {/* Animated dot */}
        <span
          className="animate-pulse"
          style={{
            width: '8px',
            height: '8px',
            background: '#16A34A',
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
            boxShadow: '0 0 8px rgba(22, 163, 74, 0.6)', // Memberi efek menyala/glowing
          }}
        />
        Live update · Donasi terus mengalir
      </div>
    </div>
  );
}