import Link from 'next/link';

interface DonasiSuksesProps {
  emailDonatur: string;
  onDonasiLagi: () => void;
}

export function DonasiSukses({ emailDonatur, onDonasiLagi }: DonasiSuksesProps) {
  const hasEmail = emailDonatur.trim() !== '';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '48px 32px',
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
        textAlign: 'center',
      }}
    >
      {/* ── Ikon sukses ── */}
      <div
        style={{
          width: '72px',
          height: '72px',
          background: 'var(--green-light)',
          border: '2px solid rgba(0, 122, 61, 0.25)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="var(--green)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* ── Heading ── */}
      <h2
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(24px, 4vw, 32px)',
          letterSpacing: '1px',
          color: 'var(--black)',
          marginBottom: '12px',
        }}
      >
        Terima Kasih atas Donasi Anda!
      </h2>

      {/* ── Subtext verifikasi ── */}
      <p
        style={{
          fontSize: '15px',
          color: 'var(--gray)',
          lineHeight: 1.7,
          marginBottom: hasEmail ? '8px' : '24px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        Donasi Anda sedang diverifikasi panitia. Proses verifikasi berlangsung dalam{' '}
        <strong style={{ color: 'var(--black)' }}>1×24 jam</strong>.
      </p>

      {/* Kalimat konfirmasi email — hanya jika email diisi */}
      {hasEmail && (
        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--blue)',
            fontWeight: 600,
            margin: '12px auto 24px',
          }}
        >
          📧 Konfirmasi donasi telah dikirim ke{' '}
          <span style={{ textDecoration: 'underline' }}>{emailDonatur}</span>.
        </p>
      )}

      {!hasEmail && <div style={{ marginBottom: '24px' }} />}

      {/* ── Info 100% tersalurkan ── */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--green-light)',
          border: '1px solid rgba(0, 122, 61, 0.2)',
          borderRadius: '8px',
          padding: '10px 18px',
          fontSize: '13px',
          color: 'var(--green)',
          fontWeight: 700,
          marginBottom: '32px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="var(--green)" />
        </svg>
        100% donasi tersalurkan untuk kemanusiaan Palestina
      </div>

      {/* ── Dua tombol aksi ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {/* Tombol Donasi Lagi */}
        <button
          type="button"
          onClick={onDonasiLagi}
          style={{
            width: '100%',
            background: 'var(--blue)',
            color: '#fff',
            padding: '13px 30px',
            borderRadius: '8px',
            fontSize: '14.5px',
            fontWeight: 700,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '1px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            border: 'none',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--blue-dark)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(26, 84, 200, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--blue)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          💚 Donasi Lagi
        </button>

        {/* Tombol Kembali ke Beranda */}
        <Link
          href="/"
          style={{
            display: 'block',
            width: '100%',
            background: 'transparent',
            color: 'var(--blue)',
            padding: '13px 30px',
            borderRadius: '8px',
            fontSize: '14.5px',
            fontWeight: 700,
            fontFamily: "'Barlow Condensed', sans-serif",
            letterSpacing: '1px',
            textTransform: 'uppercase',
            border: '1.5px solid var(--border)',
            textAlign: 'center',
            textDecoration: 'none',
            transition: 'all 0.2s',
            boxSizing: 'border-box',
          }}
        >
          ← Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}