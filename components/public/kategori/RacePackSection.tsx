// components/public/kategori/RacePackSection.tsx

'use client'

import Image from 'next/image'
import { useState } from 'react'

const RACEPACK_ITEMS = [
  { id: 'jersey', label: 'Jersey Official', icon: '👕' },
  { id: 'bib', label: 'Nomor BIB', icon: '🆔' },
  { id: 'ganci', label: 'Gantungan Kunci', icon: '🔑' },
  { id: 'pin', label: 'Pin Event', icon: '📍' },
] as const

type RacepackId = (typeof RACEPACK_ITEMS)[number]['id']

export default function RacePackSection() {
  const [activeItem, setActiveItem] = useState<RacepackId>('jersey')

  const renderPreview = () => {
    if (activeItem === 'jersey') {
      return (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '24px',
            alignItems: 'center'
          }}
        >
          {/* Lengan Pendek */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '1/1',
              marginBottom: '12px'
            }}>
              <Image
                src="/images/racepack/jersey-pendek.png"
                alt="Jersey Lengan Pendek Run For Liberation"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <h4 style={{ fontSize: '15px', color: 'var(--gray, #64748b)', fontWeight: 700 }}>
              Jersey Lengan Pendek
            </h4>
          </div>

          {/* Lengan Panjang */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              aspectRatio: '1/1',
              marginBottom: '12px'
            }}>
              <Image
                src="/images/racepack/jersey-panjang.png"
                alt="Jersey Lengan Panjang Run For Liberation"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <h4 style={{ fontSize: '15px', color: 'var(--gray, #64748b)', fontWeight: 700 }}>
              Jersey Lengan Panjang
            </h4>
          </div>
        </div>
      )
    }

    return (
      <div
        style={{
          width: '100%',
          minHeight: '350px',
          background: '#f8fafc',
          border: '2px dashed var(--blue-light, #bfdbfe)',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '56px', filter: 'grayscale(100%)', opacity: 0.4 }}>
          {RACEPACK_ITEMS.find(i => i.id === activeItem)?.icon}
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: 'var(--blue, #2563eb)', fontWeight: 700, marginBottom: '8px' }}>
            Desain Akan Menyusul
          </p>
          <p style={{ fontSize: '14px', color: 'var(--gray, #64748b)', opacity: 0.8, maxWidth: '320px', margin: '0 auto' }}>
            Panitia sedang menyiapkan desain final untuk {RACEPACK_ITEMS.find(i => i.id === activeItem)?.label}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <section
      style={{
        width: '100%',
        padding: '64px 24px',
        background: '#f8fafc',
        borderTop: '1px solid var(--border, #e2e8f0)',
        borderBottom: '1px solid var(--border, #e2e8f0)',
        marginTop: '48px'
      }}
    >
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--blue, #2563eb)', marginBottom: '12px' }}>
            Race Pack Run For Liberation 2026
          </h2>
          <p style={{ fontSize: '15px', color: 'var(--gray, #64748b)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Setiap pendaftar akan mendapatkan paket eksklusif untuk mendukung performa dan sebagai kenang-kenangan event ini. Klik item di bawah untuk melihat detail desain.
          </p>
        </div>

        {/* Menu Navigasi Racepack — compact di mobile */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '40px',
          }}
        >
          {RACEPACK_ITEMS.map((item) => {
            const isActive = activeItem === item.id
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                style={{
                  padding: '12px 8px',
                  background: isActive ? 'var(--blue, #2563eb)' : '#fff',
                  border: isActive ? '1.5px solid var(--blue, #2563eb)' : '1.5px solid var(--border, #e2e8f0)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isActive ? '0 8px 16px rgba(37, 99, 235, 0.25)' : 'var(--shadow-card, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
                  transform: isActive ? 'translateY(-4px)' : 'none'
                }}
              >
                <span style={{ fontSize: '20px' }}>{item.icon}</span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? '#ffffff' : 'var(--gray, #64748b)',
                  lineHeight: '1.3'
                }}>
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* Area Display Konten */}
        <div 
          style={{ 
            background: '#fff', 
            borderRadius: '24px', 
            padding: '40px',
            boxShadow: 'var(--shadow-card, 0 4px 6px -1px rgba(0, 0, 0, 0.1))',
            border: '1px solid var(--border, #e2e8f0)'
          }}
        >
          {renderPreview()}
        </div>
      </div>
    </section>
  )
}