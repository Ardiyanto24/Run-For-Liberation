// components/public/kategori/RuteSection.tsx

export default function RuteSection() {
  return (
    <section
      style={{
        width: '100%',
        padding: '64px 24px',
        background: '#ffffff', // Latar belakang putih agar kontras dengan section sebelumnya
        borderBottom: '1px solid var(--border, #e2e8f0)',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue, #2563eb)', marginBottom: '12px' }}>
            Rute Event Run For Liberation 2026
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--gray, #64748b)', lineHeight: '1.6' }}>
            Persiapkan dirimu untuk melewati rute yang penuh makna. Peta detail dan panduan rute untuk setiap kategori akan diumumkan dalam waktu dekat.
          </p>
        </div>

        {/* Kontainer Rute Atas - Bawah */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card Rute Fun Run */}
          <div
            style={{
              width: '100%',
              background: '#f8fafc',
              border: '2px dashed var(--blue-light, #bfdbfe)',
              borderRadius: '20px',
              padding: '48px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
            }}
          >
            <div style={{ fontSize: '56px', filter: 'grayscale(100%)', opacity: 0.5, marginBottom: '16px' }}>
              🗺️
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--black, #0f172a)', marginBottom: '8px' }}>
              Rute Fun Run (5K)
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--blue, #2563eb)', fontWeight: 700, marginBottom: '8px' }}>
              Peta Rute Akan Menyusul
            </p>
            <p style={{ fontSize: '14px', color: 'var(--gray, #64748b)', maxWidth: '400px' }}>
              Panitia sedang memastikan rute lari yang aman, nyaman, dan representatif untuk kategori lari 5K.
            </p>
          </div>

          {/* Card Rute Fun Walk */}
          <div
            style={{
              width: '100%',
              background: '#f8fafc',
              border: '2px dashed var(--blue-light, #bfdbfe)',
              borderRadius: '20px',
              padding: '48px 24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
            }}
          >
            <div style={{ fontSize: '56px', filter: 'grayscale(100%)', opacity: 0.5, marginBottom: '16px' }}>
              🚶
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--black, #0f172a)', marginBottom: '8px' }}>
              Rute Fun Walk
            </h3>
            <p style={{ fontSize: '15px', color: 'var(--blue, #2563eb)', fontWeight: 700, marginBottom: '8px' }}>
              Peta Rute Akan Menyusul
            </p>
            <p style={{ fontSize: '14px', color: 'var(--gray, #64748b)', maxWidth: '400px' }}>
              Rute jalan santai bersama keluarga sedang dalam tahap finalisasi untuk memastikan kenyamanan semua rentang usia.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}