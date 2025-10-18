# JA Tracker Frontend

LinkedIn-inspired Job Application Tracker built with Next.js 14 (App Router), TypeScript, Tailwind + shadcn-style primitives, Redux Toolkit + Redux-Saga, Axios, RHF + Zod, date-fns, framer-motion, lucide-react and sonner.

## Setup

1. Copy env

```sh
cp .env.example .env.local
```

2. Install deps (pnpm recommended)

```sh
pnpm install
```

3. Run dev

```sh
pnpm dev
```

## Env

- NEXT_PUBLIC_API_BASE_URL: Base URL for backend (defaults to Railway prod URL)

## Notes

- All API endpoint strings live in `src/constants/endpoints.ts`.
- SSR list page uses `ApplicationListSSR` with `revalidate: 30`.
- Reminders compute every 60s in `useReminders` and push toasts + right-rail list.