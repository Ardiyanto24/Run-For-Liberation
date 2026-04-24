'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { FotoGaleri } from '@/lib/galeri-data'

interface LightboxProps {
  photos: FotoGaleri[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
  currentIndex: number
  onNavigate: (index: number) => void
}

export default function Lightbox({
  photos,
  isOpen,
  onClose,
  currentIndex,
  onNavigate,
}: LightboxProps) {
  const total = photos.length

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) onNavigate(currentIndex - 1)
  }, [currentIndex, onNavigate])

  const handleNext = useCallback(() => {
    if (currentIndex < total - 1) onNavigate(currentIndex + 1)
  }, [currentIndex, total, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll saat lightbox terbuka
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handlePrev, handleNext, onClose])

  if (!isOpen || !photos[currentIndex]) return null

  const photo = photos[currentIndex]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.92)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      {/* Foto container — stop propagation agar klik foto tidak tutup */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90vw',
          maxWidth: '1100px',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          style={{ objectFit: 'contain' }}
          sizes="90vw"
          priority
        />
      </div>

      {/* Tombol Close (X) */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          color: '#fff',
          fontSize: '20px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s',
          zIndex: 10000,
        }}
        aria-label="Tutup lightbox"
      >
        ✕
      </button>

      {/* Tombol Prev */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); handlePrev() }}
          style={{
            position: 'fixed',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '52px',
            height: '52px',
            color: '#fff',
            fontSize: '22px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 10000,
          }}
          aria-label="Foto sebelumnya"
        >
          ‹
        </button>
      )}

      {/* Tombol Next */}
      {currentIndex < total - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); handleNext() }}
          style={{
            position: 'fixed',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50%',
            width: '52px',
            height: '52px',
            color: '#fff',
            fontSize: '22px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s',
            zIndex: 10000,
          }}
          aria-label="Foto berikutnya"
        >
          ›
        </button>
      )}

      {/* Counter */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px',
          padding: '6px 18px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '1px',
          zIndex: 10000,
        }}
      >
        {currentIndex + 1} / {total}
      </div>

      {/* Alt text caption */}
      <div
        style={{
          position: 'fixed',
          bottom: '64px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.55)',
          fontSize: '13px',
          textAlign: 'center',
          maxWidth: '600px',
          zIndex: 10000,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {photo.alt}
      </div>
    </div>
  )
}
