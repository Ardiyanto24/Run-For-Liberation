'use client';

import { useDonasiForm } from '@/hooks/useDonasiForm';
import { NominalSelector } from './NominalSelector';
import { DonasiSukses } from '@/components/public/donasi/DonasiSukses';
import FieldError from '@/components/public/pendaftaran/FieldError';
import MetodePembayaranSelector from '@/components/public/pendaftaran/MetodePembayaranSelector';
import UploadBuktiBayar from '@/components/public/pendaftaran/UploadBuktiBayar';
import { MetodePembayaran } from '@/types';

// ── Style helpers ─────────────────────────────────
const sectionLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: '#1A54C8', // Menggunakan HEX langsung agar aman
  marginBottom: '16px',
  display: 'block',
};

const formLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 700,
  color: '#1E293B',
  letterSpacing: '0.3px',
  marginBottom: '6px',
};

const inputStyle: React.CSSProperties = {
  background: '#F8FAFC', // Abu-abu sangat terang agar terpisah dari background card
  border: '1.5px solid #CBD5E1', // Border abu-abu tegas
  borderRadius: '8px',
  padding: '12px 14px',
  fontSize: '14px',
  color: '#0F172A',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
};

const helperTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#64748B',
  marginTop: '6px',
  lineHeight: 1.5,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '2px dashed #E2E8F0', // Pemisah seksi dibuat dashed
  margin: '32px 0', 
};

// ─────────────────────────────────────────────────

export function FormDonasi() {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    nominalMode,
    updateField,
    setNominal,
    toggleSembunyikanNama,
    handleSubmit,
    resetForm,
  } = useDonasiForm();

  // Tampilkan sukses screen jika berhasil submit
  if (isSuccess) {
    return (
      <DonasiSukses
        emailDonatur={formData.emailDonatur}
        onDonasiLagi={resetForm}
      />
    );
  }

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)', // Shadow lebih lembut
      }}
    >
      {/* Card header */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '32px',
            letterSpacing: '1px',
            color: '#0F172A',
            marginBottom: '8px',
            lineHeight: 1,
          }}
        >
          Form Donasi
        </h2>
        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.5 }}>
          Pilih nominal donasi Anda. Minimum donasi Rp 10.000.
        </p>
      </div>

      {/* ── BAGIAN 1: Nominal Donasi ── */}
      <div>
        <span style={sectionLabelStyle}>1. Pilih Nominal</span>
        <NominalSelector
          value={formData.nominal}
          nominalMode={nominalMode}
          onChange={setNominal}
          error={errors.nominal}
        />
      </div>

      <div style={dividerStyle} />

      {/* ── BAGIAN 2: Data Donatur ── */}
      <div>
        <span style={sectionLabelStyle}>2. Informasi Donatur (Opsional)</span>

        {/* Nama Donatur */}
        <div style={{ marginBottom: '16px' }}>
          <label style={formLabelStyle}>Nama Lengkap</label>
          <input
            type="text"
            placeholder="Nama Anda atau biarkan kosong"
            value={formData.namaDonatur}
            onChange={(e) => updateField('namaDonatur', e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#1A54C8';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Checkbox sembunyikan nama */}
        <div
          style={{
            background: '#EFF6FF', // Biru sangat muda
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '14px',
            marginBottom: '20px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={formData.sembunyikanNama}
              onChange={toggleSembunyikanNama}
              style={{
                marginTop: '3px',
                accentColor: '#1A54C8',
                width: '18px',
                height: '18px',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                Sembunyikan nama saya (Anonim)
              </span>
              <p style={{ ...helperTextStyle, marginTop: '4px' }}>
                Nama Anda akan ditampilkan sebagai <strong style={{ color: '#1A54C8' }}>&ldquo;Hamba Allah&rdquo;</strong> di semua tampilan publik.
              </p>
            </div>
          </label>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={formLabelStyle}>Email Anda</label>
          <input
            type="email"
            placeholder="email@contoh.com (opsional)"
            value={formData.emailDonatur}
            onChange={(e) => updateField('emailDonatur', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.emailDonatur ? '#EF4444' : '#CBD5E1',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = errors.emailDonatur ? '#EF4444' : '#1A54C8';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = errors.emailDonatur ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.emailDonatur ? '#EF4444' : '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.emailDonatur ? (
            <FieldError message={errors.emailDonatur} />
          ) : (
            <p style={helperTextStyle}>
              Kami akan mengirimkan bukti konfirmasi donasi ke email ini.
            </p>
          )}
        </div>

        {/* Pesan / Doa */}
        <div style={{ marginBottom: '8px' }}>
          <label style={formLabelStyle}>
            Doa / Pesan <span style={{ color: '#94A3B8', fontWeight: 400 }}>(Opsional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Tuliskan doa atau pesan dukungan untuk Palestina..."
            value={formData.pesan}
            onChange={(e) => updateField('pesan', e.target.value)}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '100px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#1A54C8';
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.background = '#F8FAFC';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <p style={{ ...helperTextStyle, textAlign: 'right', marginTop: '8px' }}>
            {formData.pesan.length}/500 karakter
          </p>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── BAGIAN 3: Metode Pembayaran ── */}
      <div>
        <span style={sectionLabelStyle}>3. Metode Pembayaran</span>
        <MetodePembayaranSelector
          value={formData.metodePembayaran}
          onChange={(val) => updateField('metodePembayaran', val as MetodePembayaran)}
        />
        {errors.metodePembayaran && (
          <FieldError message={errors.metodePembayaran} />
        )}
      </div>

      <div style={dividerStyle} />

      {/* ── BAGIAN 4: Upload Bukti Bayar ── */}
      <div>
        <span style={sectionLabelStyle}>4. Upload Bukti Transfer</span>
        <UploadBuktiBayar
          value={formData.buktiBayar}
          onChange={(file) => updateField('buktiBayar', file)}
        />
        {errors.buktiBayar && (
          <FieldError message={errors.buktiBayar} />
        )}
        <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
          <p style={{ fontSize: '13px', color: '#B45309', margin: 0, lineHeight: 1.5 }}>
            📌 <strong>Catatan:</strong> Bukti transfer Anda akan diverifikasi secara manual oleh panitia maksimal dalam waktu <strong>1×24 jam</strong>.
          </p>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── Trust badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '13px',
          color: '#16A34A',
          fontWeight: 700,
          marginBottom: '20px',
          background: '#DCFCE7',
          padding: '12px',
          borderRadius: '8px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="#16A34A"
          />
        </svg>
        100% dana tersalurkan untuk kemanusiaan tanpa potongan.
      </div>

      {/* ── Tombol Submit ── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%',
          background: isSubmitting ? '#94A3B8' : '#1A54C8',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 700,
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: '1px',
          textTransform: 'uppercase',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = '#0E2D7A';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(26, 84, 200, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = '#1A54C8';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {isSubmitting ? (
          <>
            <span
              style={{
                width: '18px',
                height: '18px',
                border: '3px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Memproses Donasi...
          </>
        ) : (
          'Kirim Donasi Sekarang'
        )}
      </button>

      {/* Spinner keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}