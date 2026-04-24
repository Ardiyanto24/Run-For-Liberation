'use client';

import Link from 'next/link';
import { useDonasiForm } from '@/hooks/useDonasiForm';
import { NominalSelector } from './NominalSelector';
import { DonasiSukses } from './DonasiSukses';
import { FieldError } from '@/components/public/pendaftaran/FieldError';
import { MetodePembayaranSelector } from '@/components/public/pendaftaran/MetodePembayaranSelector';
import { UploadBuktiBayar } from '@/components/public/pendaftaran/UploadBuktiBayar';
import { MetodePembayaran } from '@/types';

// ── Style helpers ─────────────────────────────────
const sectionLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: 'var(--blue)',
  marginBottom: '10px',
  display: 'block',
};

const formLabelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--black)',
  letterSpacing: '0.3px',
};

const inputStyle: React.CSSProperties = {
  background: 'var(--blue-xlight)',
  border: '1.5px solid var(--border)',
  borderRadius: '8px',
  padding: '10px 13px',
  fontSize: '14px',
  color: 'var(--black)',
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const helperTextStyle: React.CSSProperties = {
  fontSize: '12px',
  color: 'var(--gray)',
  marginTop: '4px',
  lineHeight: 1.5,
};

const dividerStyle: React.CSSProperties = {
  borderTop: '1px solid var(--border)',
  margin: '24px 0',
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
        border: '1.5px solid var(--border)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Card header */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '24px',
            letterSpacing: '1px',
            color: 'var(--black)',
            marginBottom: '4px',
          }}
        >
          Form Donasi
        </div>
        <p style={{ fontSize: '14px', color: 'var(--gray)', lineHeight: 1.5 }}>
          Pilih nominal donasi Anda. Minimum donasi Rp 10.000.
        </p>
      </div>

      {/* ── BAGIAN 1: Nominal Donasi ── */}
      <div>
        <span style={sectionLabelStyle}>Pilih Nominal Donasi</span>
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
        <span style={sectionLabelStyle}>Informasi Donatur (Opsional)</span>

        {/* Nama Donatur */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
          <label style={formLabelStyle}>Nama</label>
          <input
            type="text"
            placeholder="Nama Anda atau biarkan kosong"
            value={formData.namaDonatur}
            onChange={(e) => updateField('namaDonatur', e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--blue)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Checkbox sembunyikan nama */}
        <div
          style={{
            background: 'var(--blue-xlight)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '12px 14px',
            marginBottom: '14px',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={formData.sembunyikanNama}
              onChange={toggleSembunyikanNama}
              style={{
                marginTop: '2px',
                accentColor: 'var(--blue)',
                width: '15px',
                height: '15px',
                flexShrink: 0,
                cursor: 'pointer',
              }}
            />
            <div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--black)' }}>
                Sembunyikan nama saya
              </span>
              <p style={{ ...helperTextStyle, marginTop: '2px' }}>
                Nama Anda akan ditampilkan sebagai{' '}
                <strong style={{ color: 'var(--blue)' }}>&ldquo;Hamba Allah&rdquo;</strong>{' '}
                di semua tampilan publik.
              </p>
            </div>
          </label>
        </div>

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '4px' }}>
          <label style={formLabelStyle}>Email</label>
          <input
            type="email"
            placeholder="email@contoh.com (opsional)"
            value={formData.emailDonatur}
            onChange={(e) => updateField('emailDonatur', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.emailDonatur ? 'var(--red)' : 'var(--border)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = errors.emailDonatur ? 'var(--red)' : 'var(--blue)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = errors.emailDonatur ? 'var(--red)' : 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {errors.emailDonatur ? (
            <FieldError message={errors.emailDonatur} />
          ) : (
            <p style={helperTextStyle}>
              Kami akan mengirim konfirmasi donasi jika email diisi.
            </p>
          )}
        </div>

        {/* Pesan / Doa */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '4px', marginTop: '12px' }}>
          <label style={formLabelStyle}>
            Doa / Pesan{' '}
            <span style={{ color: 'var(--gray)', fontWeight: 400 }}>(Opsional)</span>
          </label>
          <textarea
            rows={3}
            maxLength={500}
            placeholder="Tuliskan doa atau pesan untuk Palestina (opsional)"
            value={formData.pesan}
            onChange={(e) => updateField('pesan', e.target.value)}
            style={{
              ...inputStyle,
              resize: 'vertical',
              minHeight: '80px',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'var(--blue)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(26, 84, 200, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          <p style={{ ...helperTextStyle, textAlign: 'right' }}>
            {formData.pesan.length}/500
          </p>
        </div>
      </div>

      <div style={dividerStyle} />

      {/* ── BAGIAN 3: Metode Pembayaran ── */}
      <div>
        <span style={sectionLabelStyle}>Metode Pembayaran</span>
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
        <span style={sectionLabelStyle}>Upload Bukti Pembayaran</span>
        <UploadBuktiBayar
          value={formData.buktiBayar}
          onChange={(file) => updateField('buktiBayar', file)}
        />
        {errors.buktiBayar && (
          <FieldError message={errors.buktiBayar} />
        )}
        <p style={{ ...helperTextStyle, marginTop: '8px' }}>
          📌 Bukti transfer akan diverifikasi panitia dalam{' '}
          <strong>1×24 jam</strong>.
        </p>
      </div>

      <div style={dividerStyle} />

      {/* ── Trust badge ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          fontSize: '12.5px',
          color: 'var(--green)',
          fontWeight: 600,
          marginBottom: '16px',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
            fill="var(--green)"
          />
        </svg>
        100% dana tersalurkan untuk Gaza tanpa potongan
      </div>

      {/* ── Tombol Submit ── */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%',
          background: isSubmitting ? 'var(--gray)' : 'var(--blue)',
          color: '#fff',
          padding: '14px',
          borderRadius: '8px',
          fontSize: '15px',
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
            e.currentTarget.style.background = 'var(--blue-dark)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 22px rgba(26, 84, 200, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.background = 'var(--blue)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {isSubmitting ? (
          <>
            <span
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            Mengirim...
          </>
        ) : (
          '💚 Kirim Donasi'
        )}
      </button>

      {/* Spinner keyframe — inline style global workaround */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}