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
            gap: '10px',
        }}
        >
        {/* Terkumpul */}
        <div
          style={{
            background: 'var(--blue-xlight)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '3px',
              color: 'var(--green)',
            }}
          >
            {formatRupiah(totalTerkumpul)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gray)' }}>
            Terkumpul
          </span>
        </div>

        {/* Total Donatur */}
        <div
          style={{
            background: 'var(--blue-xlight)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '3px',
              color: 'var(--red)',
            }}
          >
            {jumlahDonatur.toLocaleString('id-ID')}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gray)' }}>
            Total Donatur
          </span>
        </div>

        {/* Target */}
        <div
          style={{
            background: 'var(--blue-xlight)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '3px',
              color: 'var(--blue)',
            }}
          >
            {formatRupiah(targetDonasi)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gray)' }}>
            Target
          </span>
        </div>

        {/* Tercapai % */}
        <div
          style={{
            background: 'var(--blue-xlight)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '16px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '28px',
              display: 'block',
              lineHeight: 1,
              marginBottom: '3px',
              color: 'var(--blue-darker)',
            }}
          >
            {pct}%
          </span>
          <span style={{ fontSize: '11px', color: 'var(--gray)' }}>
            Tercapai
          </span>
        </div>
      </div>

      {/* ── Progress Bar Box ── */}
      <div
        style={{
          background: 'var(--blue-xlight)',
          borderRadius: '14px',
          padding: '26px',
          marginTop: '22px',
          marginBottom: '16px',
          border: '1.5px solid var(--border)',
        }}
      >
        {/* Top: nominal terkumpul + label target */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '34px',
              color: 'var(--green)',
              letterSpacing: '1px',
              lineHeight: 1,
            }}
          >
            {formatRupiah(totalTerkumpul)}
          </span>
          <span
            style={{
              fontSize: '13.5px',
              color: 'var(--gray)',
              paddingBottom: '3px',
            }}
          >
            Target: {formatRupiah(targetDonasi)}
          </span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: '10px',
            background: 'var(--gray-light)',
            borderRadius: '999px',
            overflow: 'hidden',
            marginBottom: '8px',
          }}
        >
          {/* Progress Fill — animasi dari v5: progressBar keyframe */}
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              background: 'linear-gradient(90deg, var(--green), #00c55c)',
              borderRadius: '999px',
              transition: 'width 1.8s ease',
            }}
          />
        </div>

        {/* Meta text */}
        <p style={{ fontSize: '13px', color: 'var(--gray)', margin: 0 }}>
          <span style={{ color: 'var(--green)', fontWeight: 700 }}>
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
          background: 'var(--green-light)',
          border: '1px solid rgba(0, 122, 61, 0.2)',
          borderRadius: '6px',
          padding: '8px 14px',
          fontSize: '13px',
          color: 'var(--green)',
          fontWeight: 700,
          marginTop: '4px',
        }}
      >
        {/* Animated dot — pulse animation dari globals.css */}
        <span
          className="animate-pulse"
          style={{
            width: '7px',
            height: '7px',
            background: 'var(--green)',
            borderRadius: '50%',
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        Live update · Donasi terus mengalir
      </div>
    </div>
  );
}