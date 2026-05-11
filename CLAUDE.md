# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Run For Liberation 2026** — a charity run/walk event registration and management system built for a sporting event in Solo, Indonesia. Features participant registration, payment verification, e-ticket generation, QR-based check-in, donation tracking, and treasurer financial management.

## Commands

```bash
npm run dev       # Start development server (Next.js)
npm run build     # Production build
npm run lint      # Run ESLint
npx prisma studio # Open Prisma database GUI
npx prisma migrate dev --name <name>  # Create and apply a migration
npx prisma db seed                    # Seed default admin account
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 App Router with TypeScript (strict mode)
- **Database:** PostgreSQL via Prisma ORM
- **Storage:** Supabase (proof-of-payment uploads, race pack files)
- **Email:** Resend (`lib/emails.ts`)
- **Auth:** Custom JWT with `jose` (no NextAuth)
- **UI:** shadcn/ui + Tailwind CSS + sonner (toasts)
- **PDF/E-ticket:** `@react-pdf/renderer` + `satori` for image preview
- **Validation:** Zod (`lib/validation.ts`)

### Route Groups & Access Control

Middleware (`middleware.ts`) guards all panel routes using JWT cookies at the edge:

| Route group | Cookie | Role required |
|---|---|---|
| `(public)/` | — | None |
| `(admin)/admin/` | `admin_session` | `SUPERADMIN` |
| `(bendahara)/bendahara/` | `admin_session` | `BENDAHARA` |
| `(panitia)/panitia/` | `admin_session` | `PANITIA` |
| `(public)/cek-status/dashboard` | `peserta_session` | Logged-in peserta |

Peserta authenticate via magic link email (one-time token → `/api/auth/magic-link` → `peserta_session` JWT). Admins log in with email + bcrypt password.

### Data Flow Pattern

- **Mutations:** Server Actions in `actions/` (not API routes) — used for registration, payment, admin ops, treasurer ops
- **Reads:** Direct Prisma queries in page server components or `lib/queries/`
- **File uploads:** Client uploads directly to Supabase using an anon key (`lib/supabase-client.ts`), then stores the URL in the database
- **Signed URLs:** `actions/get-signed-url.ts` generates 5-minute expiry links for viewing uploaded proofs

### Key Domain Models (Prisma)

- **Peserta** — Participant (INDIVIDU or KELUARGA type), holds bib number, QR token, jersey size, status
- **Anggota** — Family members belonging to a KELUARGA Peserta
- **Pembayaran** — Payment record with upload URL; one per Peserta registration
- **Donasi** — Standalone donations (not tied to Peserta)
- **CheckIn** — Created by QR scan at event day (`/api/scan/validate`)
- **Pengeluaran / PemasukanManual / TransferAntar** — Treasurer financial records

### Pricing

Race prices are driven by environment variables (`HARGA_FUN_RUN_GAZA_PANJANG`, etc.) and calculated in `lib/utils.ts`. Rafah category price is per-person and multiplied by actual family member count.

### Financial System (Bendahara)

The treasurer module (`(bendahara)/`, `actions/bendahara.ts`) tracks income allocated into "kantong" (fund buckets): `RACE_PACK`, `OPERASIONAL`, `DONASI`. Income sources: `KAS` (registration fees) and `SPONSOR`. The large `actions/bendahara.ts` (~55KB) handles all finance mutations.

### Environment Variables

Required in `.env.local`:

```
DATABASE_URL=           # Pooled connection (Prisma + app)
DIRECT_URL=             # Direct connection (migrations)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=             # Peserta session
ADMIN_JWT_SECRET=       # Admin session
QR_SECRET_KEY=          # QR token HMAC
RESEND_API_KEY=
NEXT_PUBLIC_BASE_URL=
TARGET_DONASI=          # Donation target in IDR
HARGA_FUN_RUN_GAZA_PANJANG=
HARGA_FUN_RUN_GAZA_PENDEK=
HARGA_FUN_WALK_GAZA_PANJANG=
HARGA_FUN_WALK_GAZA_PENDEK=
HARGA_FUN_RUN_RAFAH=
HARGA_FUN_WALK_RAFAH=
```

Seed-only (remove after first seed):
```
ADMIN_EMAIL_SEED=
ADMIN_PASSWORD_SEED=
```

### Conventions

- Server Actions are the mutation layer — avoid creating API routes for data mutations
- `lib/validation.ts` contains all Zod schemas; add new ones there
- Registration form state lives in `hooks/usePendaftaranForm.ts` (multi-step form)
- shadcn/ui components are in `components/ui/`; domain components are organized by panel (`components/admin/`, `components/bendahara/`, `components/panitia/`, `components/public/`)
- ESLint errors are ignored during `next build` (configured in `next.config.mjs`)
