'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { FotoGaleri } from '@/lib/galeri-data'
import Lightbox from './Lightbox'

interface GaleriGridProps {
  photos: FotoGaleri[]
}

export default function GaleriGrid({ photos }: GaleriGridProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handlePhotoClick = (index: number) => {
    setSelectedIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <>
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
        }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            onClick={() => handlePhotoClick(index)}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
              border: '1.5px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
              background: 'var(--blue-xlight)',
            }}
            className="group"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.35s ease' }}
              className="group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {/* Hover overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(14, 45, 122, 0)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.25s',
              }}
              className="group-hover:bg-[rgba(14,45,122,0.45)]"
            >
              <span
                style={{
                  fontSize: '28px',
                  opacity: 0,
                  transform: 'scale(0.7)',
                  transition: 'all 0.25s',
                }}
                className="group-hover:opacity-100 group-hover:scale-100"
              >
                🔍
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        photos={photos}
        initialIndex={selectedIndex}
        currentIndex={selectedIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={setSelectedIndex}
      />
    </>
  )
}
