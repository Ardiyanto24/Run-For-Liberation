// components/public/pendaftaran/UploadBuktiBayar.tsx

"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { validateFileBuktiBayar } from "@/lib/utils";
import FieldError from "@/components/public/pendaftaran/FieldError";

// ============================================================
// HELPER
// ============================================================
function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type === "image/jpeg" || file.type === "image/png";
}

// ============================================================
// PROPS
// ============================================================
interface UploadBuktiBayarProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

// ============================================================
// KOMPONEN
// ============================================================
export default function UploadBuktiBayar({
  value,
  onChange,
  error,
}: UploadBuktiBayarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  // --------------------------------------------------------
  // PROSES FILE
  // --------------------------------------------------------
  function processFile(file: File) {
    const validationError = validateFileBuktiBayar(file);
    if (validationError) {
      setLocalError(validationError);
      onChange(null);
      setPreviewUrl(null);
      return;
    }

    setLocalError(null);
    onChange(file);

    // Buat preview URL jika gambar
    if (isImageFile(file)) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  // --------------------------------------------------------
  // HANDLER
  // --------------------------------------------------------
  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  }

  function handleRemove() {
    onChange(null);
    setPreviewUrl(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClickZone() {
    inputRef.current?.click();
  }

  // --------------------------------------------------------
  // RENDER: Preview file
  // --------------------------------------------------------
  if (value) {
    return (
      <div>
        <div className="border border-[rgba(26,84,200,0.13)] rounded-xl bg-[#F5F8FF] overflow-hidden">
          {/* Preview gambar */}
          {isImageFile(value) && previewUrl && (
            <div className="relative w-full h-40 bg-[#EEF3FF]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview bukti bayar"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* Info file */}
          <div className="flex items-center gap-3 px-4 py-3">
            {/* Ikon */}
            <div className="w-9 h-9 rounded-lg bg-[#EEF3FF] flex items-center justify-center flex-shrink-0">
              {isImageFile(value) ? (
                <svg className="w-4 h-4 text-[#1A54C8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-[#CE1126]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>

            {/* Nama & ukuran */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A1628] truncate">
                {value.name}
              </p>
              <p className="text-xs text-[#6B7A99]">
                {formatFileSize(value.size)}
              </p>
            </div>

            {/* Tombol hapus */}
            <button
              type="button"
              onClick={handleRemove}
              className="w-7 h-7 rounded-full bg-red-50 border border-[#CE1126]/20 flex items-center justify-center flex-shrink-0 hover:bg-red-100 transition-colors"
            >
              <svg className="w-3.5 h-3.5 text-[#CE1126]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#6B7A99] mt-2">
          Format: JPG, PNG, atau PDF. Maksimal 5MB.
        </p>

        <FieldError message={error} />
      </div>
    );
  }

  // --------------------------------------------------------
  // RENDER: Drop zone (belum ada file)
  // --------------------------------------------------------
  return (
    <div>
      <div
        onClick={handleClickZone}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-all duration-200 bg-[#F5F8FF] relative",
          isDragging
            ? "border-[#1A54C8] bg-[#EEF3FF]"
            : "border-[rgba(26,84,200,0.20)] hover:border-[#4A7CE8] hover:bg-[#EEF3FF]",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,application/pdf"
          onChange={handleInputChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />

        <span className="text-3xl block mb-2">📎</span>
        <p className="text-sm font-bold text-[#0A1628] mb-1">
          {isDragging ? "Lepaskan file di sini" : "Klik atau seret file ke sini"}
        </p>
        <p className="text-xs text-[#6B7A99]">
          JPG, PNG, atau PDF — maksimal 5MB
        </p>
      </div>

      {/* Local error dari validasi */}
      {localError && <FieldError message={localError} />}

      {/* Error dari parent (hook) */}
      {!localError && <FieldError message={error} />}

      <p className="text-[11px] text-[#6B7A99] mt-2">
        Format: JPG, PNG, atau PDF. Maksimal 5MB.
      </p>
    </div>
  );
}