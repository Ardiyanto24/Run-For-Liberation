'use client';

import FieldError from '@/components/public/pendaftaran/FieldError';

// ── Konstanta preset nominal ──
const PRESET_NOMINALS = [
  { label: 'Rp 50.000', value: 50000 },
  { label: 'Rp 100.000', value: 100000 },
  { label: 'Rp 200.000', value: 200000 },
  { label: 'Rp 500.000', value: 500000 },
  { label: 'Rp 1.000.000', value: 1000000 },
] as const;



interface NominalSelectorProps {
  value: number;
  nominalMode: 'preset' | 'custom';
  onChange: (nominal: number, mode: 'preset' | 'custom') => void;
  error?: string;
}

export function NominalSelector({
  value,
  nominalMode,
  onChange,
  error,
}: NominalSelectorProps) {
  const isCustomMode = nominalMode === 'custom';

  function handlePresetClick(nominal: number) {
    onChange(nominal, 'preset');
  }

  function handleCustomClick() {
    // Saat klik "Nominal Lain", reset nominal ke 0 dan aktifkan custom mode
    onChange(0, 'custom');
  }

  function handleCustomInput(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = parseInt(e.target.value, 10);
    const val = isNaN(raw) || raw < 0 ? 0 : raw;
    onChange(val, 'custom');
  }

  return (
    <div>
      {/* ── Grid 3 kolom preset ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '9px',
          marginBottom: '14px',
        }}
      >
        {/* Preset angka */}
        {PRESET_NOMINALS.map((preset) => {
          const isSelected = nominalMode === 'preset' && value === preset.value;
          return (
            <button
              key={preset.value}
              type="button"
              onClick={() => handlePresetClick(preset.value)}
              style={{
                background: isSelected ? 'var(--blue)' : 'var(--blue-xlight)',
                border: `1.5px solid ${isSelected ? 'var(--blue)' : 'var(--border)'}`,
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: 700,
                color: isSelected ? '#fff' : 'var(--blue-darker)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--blue-mid)';
                  e.currentTarget.style.background = 'var(--blue-light)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--blue-xlight)';
                }
              }}
            >
              {preset.label}
            </button>
          );
        })}

        {/* "Nominal Lain" button */}
        <button
          type="button"
          onClick={handleCustomClick}
          style={{
            background: isCustomMode ? 'var(--blue)' : 'var(--blue-xlight)',
            border: `1.5px solid ${isCustomMode ? 'var(--blue)' : 'var(--border)'}`,
            borderRadius: '8px',
            padding: '10px',
            textAlign: 'center',
            fontSize: '13px',
            fontWeight: 700,
            color: isCustomMode ? '#fff' : 'var(--blue-darker)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            if (!isCustomMode) {
              e.currentTarget.style.borderColor = 'var(--blue-mid)';
              e.currentTarget.style.background = 'var(--blue-light)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isCustomMode) {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.background = 'var(--blue-xlight)';
            }
          }}
        >
          Nominal Lain
        </button>
      </div>

      {/* ── Input custom — hanya tampil saat mode custom ── */}
      {isCustomMode && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--blue-xlight)',
            border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '6px',
          }}
        >
          {/* Prefix "Rp" */}
          <span
            style={{
              padding: '0 12px',
              fontSize: '14px',
              fontWeight: 700,
              color: 'var(--gray)',
              borderRight: '1px solid var(--border)',
              lineHeight: '44px',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            Rp
          </span>

          {/* Number input */}
          <input
            type="number"
            min={0}
            placeholder="Masukkan nominal (min. Rp 10.000)"
            value={value > 0 ? value : ''}
            onChange={handleCustomInput}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '11px 13px',
              fontSize: '14px',
              color: 'var(--black)',
              fontFamily: 'inherit',
              outline: 'none',
              flex: 1,
              width: '100%',
            }}
          />
        </div>
      )}

      {/* Error message */}
      {error && <FieldError message={error} />}
    </div>
  );
}