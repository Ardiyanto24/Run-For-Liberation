"use client";

import {
  FormDataAnggota,
  FormDataPeserta,
  JenisKelamin,
  TipePendaftaran,
  UkuranJersey,
} from "@/types";
import FieldError from "./FieldError";

// ============================================================
// KONSTANTA OPSI SELECT
// ============================================================
const JENIS_KELAMIN_OPTIONS: { value: JenisKelamin; label: string }[] = [
  { value: "LAKI_LAKI", label: "Laki-laki" },
  { value: "PEREMPUAN", label: "Perempuan" },
];

const UKURAN_JERSEY_OPTIONS: { value: UkuranJersey; label: string }[] = [
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

// ============================================================
// SUB-KOMPONEN: FormField (input text/email/tel/date)
// ============================================================
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function FormField({ label, required = true, error, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[#0A1628] tracking-wide">
        {label}
        {required && <span className="text-[#CE1126] ml-0.5">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: StyledInput
// ============================================================
interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

function StyledInput({ hasError, className = "", ...props }: StyledInputProps) {
  return (
    <input
      {...props}
      className={[
        "w-full bg-[#F5F8FF] border-[1.5px] rounded-lg px-3 py-2.5 text-sm text-[#0A1628] font-['Barlow',sans-serif] outline-none transition-all duration-200",
        "placeholder:text-[#6B7A99]",
        "focus:border-[#1A54C8] focus:shadow-[0_0_0_3px_rgba(26,84,200,0.10)]",
        hasError
          ? "border-[#CE1126] bg-red-50"
          : "border-[rgba(26,84,200,0.13)] hover:border-[#4A7CE8]",
        className,
      ].join(" ")}
    />
  );
}

// ============================================================
// SUB-KOMPONEN: StyledSelect
// ============================================================
interface StyledSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

function StyledSelect({ hasError, className = "", children, ...props }: StyledSelectProps) {
  return (
    <select
      {...props}
      className={[
        "w-full bg-[#F5F8FF] border-[1.5px] rounded-lg px-3 py-2.5 text-sm text-[#0A1628] outline-none transition-all duration-200 cursor-pointer",
        "focus:border-[#1A54C8] focus:shadow-[0_0_0_3px_rgba(26,84,200,0.10)]",
        hasError
          ? "border-[#CE1126] bg-red-50"
          : "border-[rgba(26,84,200,0.13)] hover:border-[#4A7CE8]",
        className,
      ].join(" ")}
    >
      {children}
    </select>
  );
}

// ============================================================
// SUB-KOMPONEN: FormPeserta (form data individu / ketua)
// ============================================================
interface FormPesertaProps {
  data: FormDataPeserta;
  errors: Record<string, string>;
  onUpdate: (field: keyof FormDataPeserta, value: string) => void;
  isKetua?: boolean;
}

function FormPeserta({ data, errors, onUpdate, isKetua = false }: FormPesertaProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Nama Lengkap */}
      <FormField label={isKetua ? "Nama Lengkap Ketua" : "Nama Lengkap"} error={errors.namaLengkap}>
        <StyledInput
          type="text"
          placeholder="Masukkan nama lengkap"
          value={data.namaLengkap}
          onChange={(e) => onUpdate("namaLengkap", e.target.value)}
          hasError={!!errors.namaLengkap}
        />
      </FormField>

      {/* Email */}
      <FormField label="Email" error={errors.email}>
        <StyledInput
          type="email"
          placeholder="contoh@email.com"
          value={data.email}
          onChange={(e) => onUpdate("email", e.target.value)}
          hasError={!!errors.email}
        />
      </FormField>

      {/* Nomor WhatsApp */}
      <FormField label="Nomor WhatsApp" error={errors.noWhatsapp}>
        <StyledInput
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={data.noWhatsapp}
          onChange={(e) => onUpdate("noWhatsapp", e.target.value)}
          hasError={!!errors.noWhatsapp}
        />
      </FormField>

      {/* Tanggal Lahir */}
      <FormField label="Tanggal Lahir" error={errors.tanggalLahir}>
        <StyledInput
          type="date"
          value={data.tanggalLahir}
          onChange={(e) => onUpdate("tanggalLahir", e.target.value)}
          hasError={!!errors.tanggalLahir}
        />
      </FormField>

      {/* Jenis Kelamin */}
      <FormField label="Jenis Kelamin" error={errors.jenisKelamin}>
        <StyledSelect
          value={data.jenisKelamin}
          onChange={(e) => onUpdate("jenisKelamin", e.target.value)}
          hasError={!!errors.jenisKelamin}
        >
          <option value="">-- Pilih Jenis Kelamin --</option>
          {JENIS_KELAMIN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
      </FormField>

      {/* Ukuran Jersey */}
      <FormField label="Ukuran Jersey" error={errors.ukuranJersey}>
        <StyledSelect
          value={data.ukuranJersey}
          onChange={(e) => onUpdate("ukuranJersey", e.target.value)}
          hasError={!!errors.ukuranJersey}
        >
          <option value="">-- Pilih Ukuran --</option>
          {UKURAN_JERSEY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
      </FormField>

      {/* Nama Kontak Darurat */}
      <FormField label="Nama Kontak Darurat" error={errors.namaKontak}>
        <StyledInput
          type="text"
          placeholder="Nama keluarga / teman dekat"
          value={data.namaKontak}
          onChange={(e) => onUpdate("namaKontak", e.target.value)}
          hasError={!!errors.namaKontak}
        />
      </FormField>

      {/* Nomor Kontak Darurat */}
      <FormField label="Nomor Kontak Darurat" error={errors.noKontak}>
        <StyledInput
          type="tel"
          placeholder="08xxxxxxxxxx"
          value={data.noKontak}
          onChange={(e) => onUpdate("noKontak", e.target.value)}
          hasError={!!errors.noKontak}
        />
      </FormField>
    </div>
  );
}

// ============================================================
// SUB-KOMPONEN: CardAnggota
// ============================================================
interface CardAnggotaProps {
  anggota: FormDataAnggota;
  index: number;
  errors: Record<string, string>;
  canDelete: boolean;
  onUpdate: (index: number, field: keyof FormDataAnggota, value: string) => void;
  onRemove: (index: number) => void;
}

function CardAnggota({ anggota, index, errors, canDelete, onUpdate, onRemove }: CardAnggotaProps) {
  return (
    <div className="border-[1.5px] border-[rgba(26,84,200,0.13)] rounded-xl p-4 bg-[#F5F8FF]">
      {/* Header card */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[#1A54C8]">
          Anggota {index + 1}
        </h4>
        <button
          type="button"
          onClick={() => onRemove(index)}
          disabled={!canDelete}
          className={[
            "flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-200",
            canDelete
              ? "text-[#CE1126] hover:bg-red-50 border border-[#CE1126]/30"
              : "text-[#6B7A99] border border-[#E4E9F5] cursor-not-allowed opacity-50",
          ].join(" ")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Hapus
        </button>
      </div>

      {/* Fields anggota */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Nama Lengkap */}
        <FormField
          label="Nama Lengkap"
          error={errors[`anggota_${index}_namaLengkap`]}
        >
          <StyledInput
            type="text"
            placeholder="Nama lengkap anggota"
            value={anggota.namaLengkap}
            onChange={(e) => onUpdate(index, "namaLengkap", e.target.value)}
            hasError={!!errors[`anggota_${index}_namaLengkap`]}
          />
        </FormField>

        {/* Tanggal Lahir */}
        <FormField
          label="Tanggal Lahir"
          error={errors[`anggota_${index}_tanggalLahir`]}
        >
          <StyledInput
            type="date"
            value={anggota.tanggalLahir}
            onChange={(e) => onUpdate(index, "tanggalLahir", e.target.value)}
            hasError={!!errors[`anggota_${index}_tanggalLahir`]}
          />
        </FormField>

        {/* Jenis Kelamin */}
        <FormField
          label="Jenis Kelamin"
          error={errors[`anggota_${index}_jenisKelamin`]}
        >
          <StyledSelect
            value={anggota.jenisKelamin}
            onChange={(e) => onUpdate(index, "jenisKelamin", e.target.value)}
            hasError={!!errors[`anggota_${index}_jenisKelamin`]}
          >
            <option value="">-- Pilih --</option>
            {JENIS_KELAMIN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </StyledSelect>
        </FormField>

        {/* Ukuran Jersey */}
        <FormField
          label="Ukuran Jersey"
          error={errors[`anggota_${index}_ukuranJersey`]}
        >
          <StyledSelect
            value={anggota.ukuranJersey}
            onChange={(e) => onUpdate(index, "ukuranJersey", e.target.value)}
            hasError={!!errors[`anggota_${index}_ukuranJersey`]}
          >
            <option value="">-- Pilih --</option>
            {UKURAN_JERSEY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </StyledSelect>
        </FormField>
      </div>
    </div>
  );
}

// ============================================================
// PROPS UTAMA
// ============================================================
interface Step3DataDiriProps {
  tipe: TipePendaftaran;
  peserta: FormDataPeserta;
  anggota: FormDataAnggota[];
  errors: Record<string, string>;
  onUpdatePeserta: (field: keyof FormDataPeserta, value: string) => void;
  onUpdateAnggota: (index: number, field: keyof FormDataAnggota, value: string) => void;
  onAddAnggota: () => void;
  onRemoveAnggota: (index: number) => void;
}

// ============================================================
// KOMPONEN UTAMA
// ============================================================
export default function Step3DataDiri({
  tipe,
  peserta,
  anggota,
  errors,
  onUpdatePeserta,
  onUpdateAnggota,
  onAddAnggota,
  onRemoveAnggota,
}: Step3DataDiriProps) {
  const isKelompok = tipe === "KELOMPOK";

  return (
    <div>
      {/* Judul Step */}
      <h2 className="font-['Bebas_Neue'] text-3xl text-[#0A1628] tracking-wide mb-1">
        {isKelompok ? "Data Ketua Kelompok" : "Data Diri"}
      </h2>
      <p className="text-sm text-[#6B7A99] mb-7 leading-relaxed">
        {isKelompok
          ? "Isi data ketua kelompok. Data anggota diisi di bagian bawah."
          : "Pastikan data sesuai identitas resmi Anda."}
      </p>

      {/* Form data peserta / ketua */}
      <FormPeserta
        data={peserta}
        errors={errors}
        onUpdate={onUpdatePeserta}
        isKetua={isKelompok}
      />

      {/* Section khusus KELOMPOK */}
      {isKelompok && (
        <div className="mt-8">
          {/* Nama Kelompok (opsional) */}
          <div className="mb-6">
            <FormField label="Nama Kelompok" required={false} error={errors.namaKelompok}>
              <StyledInput
                type="text"
                placeholder="Nama kelompok Anda (opsional)"
                hasError={!!errors.namaKelompok}
              />
            </FormField>
          </div>

          {/* Header section anggota */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-['Bebas_Neue'] text-xl text-[#0A1628] tracking-wide">
                Anggota Kelompok
              </h3>
              <p className="text-xs text-[#6B7A99] mt-0.5">
                {anggota.length} dari maksimal 5 anggota (tidak termasuk ketua)
              </p>
            </div>
          </div>

          {/* Error anggota global */}
          {errors.anggota && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-[#CE1126]/20">
              <p className="text-xs text-[#CE1126] font-semibold">{errors.anggota}</p>
            </div>
          )}

          {/* List card anggota */}
          <div className="flex flex-col gap-4 mb-4">
            {anggota.map((item, idx) => (
              <CardAnggota
                key={idx}
                anggota={item}
                index={idx}
                errors={errors}
                canDelete={anggota.length > 1}
                onUpdate={onUpdateAnggota}
                onRemove={onRemoveAnggota}
              />
            ))}
          </div>

          {/* Tombol Tambah Anggota */}
          <button
            type="button"
            onClick={onAddAnggota}
            disabled={anggota.length >= 5}
            className={[
              "w-full py-3 rounded-xl border-[1.5px] border-dashed text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              anggota.length >= 5
                ? "border-[#E4E9F5] text-[#6B7A99] cursor-not-allowed opacity-60"
                : "border-[#1A54C8]/40 text-[#1A54C8] hover:bg-[#EEF3FF] hover:border-[#1A54C8]",
            ].join(" ")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {anggota.length >= 5 ? "Maksimal 5 anggota tercapai" : "Tambah Anggota"}
          </button>
        </div>
      )}
    </div>
  );
}