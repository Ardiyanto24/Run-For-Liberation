// components/public/kategori/KategoriTabs.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const TABS = [
  { slug: 'syarat', label: 'Syarat & Ketentuan' },
  { slug: 'rute', label: 'Rute Lari' },
  { slug: 'panduan', label: 'Panduan Event' },
] as const

type TabSlug = (typeof TABS)[number]['slug']

export default function KategoriTabs() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = (searchParams.get('tab') as TabSlug) ?? 'syarat'

  const handleTabClick = useCallback(
    (slug: TabSlug) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', slug)
      router.push(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  return (
    <div
      style={{
        background: '#fff',
        border: '1.5px solid var(--border)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Tab Navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1.5px solid var(--border)',
          background: 'var(--blue-xlight)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.slug
          return (
            <button
              key={tab.slug}
              onClick={() => handleTabClick(tab.slug)}
              style={{
                flex: 1,
                padding: '14px 20px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--blue)' : 'var(--gray)',
                background: isActive ? '#fff' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2.5px solid var(--blue)' : '2.5px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.3px',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div style={{ padding: '36px' }}>
        {activeTab === 'syarat' && (
          <div>
            {/* TODO: isi konten S&K dari panitia */}
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📋</div>
              <p style={{ fontSize: '16px', color: 'var(--gray)', lineHeight: '1.75' }}>
                Syarat & Ketentuan akan segera diumumkan.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--gray)', opacity: 0.6, marginTop: '8px' }}>
                Pantau terus update dari panitia.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'rute' && (
          <div>
            {/* TODO: isi ilustrasi atau peta rute dari panitia */}
            <div
              style={{
                width: '100%',
                minHeight: '320px',
                background: 'var(--blue-xlight)',
                border: '2px dashed var(--blue-light)',
                borderRadius: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <div style={{ fontSize: '48px' }}>🗺️</div>
              <p style={{ fontSize: '16px', color: 'var(--gray)', fontWeight: 600 }}>
                Rute lari akan segera diumumkan.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--gray)', opacity: 0.6 }}>
                Peta & ilustrasi rute akan tampil di sini.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'panduan' && (
          <div>
            {/* TODO: isi panduan event dari panitia */}
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>📖</div>
              <p style={{ fontSize: '16px', color: 'var(--gray)', lineHeight: '1.75' }}>
                Panduan event akan segera diumumkan.
              </p>
              <p style={{ fontSize: '13px', color: 'var(--gray)', opacity: 0.6, marginTop: '8px' }}>
                Informasi teknis hari H akan tersedia di sini.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
