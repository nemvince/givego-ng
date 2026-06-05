# GiveGo

**GiveGo** is a community volunteering platform that helps organizers create and manage events, and lets volunteers discover causes, sign up in one tap, and track their impact.

Built with Next.js 16, React 19, PostgreSQL, and deployed on Railway.

---

## Table of Contents

- [GiveGo](#givego)
  - [Table of Contents](#table-of-contents)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Environment Variables](#environment-variables)
    - [Install \& Run](#install--run)
    - [Database Setup](#database-setup)
    - [Image Upload](#image-upload)
  - [Development](#development)
    - [Available Scripts](#available-scripts)
    - [Code Standards](#code-standards)
    - [Internationalization](#internationalization)
  - [Railway Development](#railway-development)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Server Components) |
| Runtime | [Bun](https://bun.sh) |
| Language | TypeScript 6 |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team) |
| Auth | [Better Auth](https://better-auth.com) (email/password, passkeys, OTP) |
| File Uploads | [Better Upload](https://better-upload.com) + Tigris (on Railway) |
| UI | [shadcn/ui](https://ui.shadcn.com) (Base UI primitives) + [Phosphor Icons](https://phosphoricons.com) |
| Styling | Tailwind CSS 4 |
| Forms | React Hook Form + Zod |
| i18n | [next-intl](https://next-intl.dev) (English, Hungarian) |
| Maps | Leaflet + react-leaflet |
| Geocoding | Photon by [komoot](https://photon.komoot.io) |
| Charts | Recharts |
| Lint/Format | [Ultracite](https://www.ultracite.ai/) (Biome) |
| Deploy | [Railway](https://railway.com) → Railway |

---

## Getting Started

### Prerequisites

- **Bun** >= 1.x (package manager + runtime)
- **PostgreSQL** (local or Railway)
- **Tigris** account (S3-compatible storage for uploads)

> [!TIP]
> Need a disposable postgres instance? Use my handy-dandy little script [pg-dispo](https://gist.github.com/nemvince/89c8f12e8dd4f4eec8d31aa9a9018a73#file-pg-dispo)

Use [mise](https://mise.jdx.dev) to manage tool versions:

```sh
mise trust        # trust the mise.toml
mise install      # install bun + railway CLI
```

### Environment Variables

Copy the example env and fill in your values:

```sh
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_URL` | App URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_SECRET` | Auth encryption secret (min 16 chars) |
| `BETTER_UPLOAD_HOST` | Tigris endpoint URL |
| `BETTER_UPLOAD_REGION` | Tigris region (`auto`) |
| `BETTER_UPLOAD_BUCKET_NAME` | Tigris bucket name |
| `BETTER_UPLOAD_KEY_ID` | Tigris access key ID |
| `BETTER_UPLOAD_SECRET` | Tigris secret access key |

### Install & Run

```sh
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database Setup

Seed tags (required before creating events):

```sh
bun db:seed
```

Seed sample events (requires an existing user account):

```sh
bun db:seed-events
```

### Image Upload

Configure CORS on the Tigris bucket before uploading:

```sh
bun run scripts/configure-cors.ts
```

---

## Development

### Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server |
| `bun build` | Production build |
| `bun start` | Start production server |
| `bun typecheck` | Run TypeScript check |
| `bun check` | Run Ultracite/Biome lint check |
| `bun fix` | Auto-fix lint/format issues |
| `bun db:generate` | Generate Drizzle SQL migrations |
| `bun db:migrate` | Run pending migrations |
| `bun db:seed` | Seed tags |
| `bun db:studio` | Open Drizzle Studio |

### Code Standards

This project uses **Ultracite** (Biome) for formatting and linting. Run before committing:

```sh
bun fix
```

Key conventions:
- Server Components for data fetching, Client Components for interactivity
- `InferSelectModel` from Drizzle for all DB row types — no hand-written type aliases
- Phosphor Icons via `@phosphor-icons/react` (client) or `@phosphor-icons/react/ssr` (server)
- `next-intl` for all user-facing strings — no hardcoded English text
- Component files co-located with their route (e.g. `app/events/[id]/actions.ts`)

### Internationalization

All user-facing strings live in `messages/` (English + Hungarian). Adding a new string:

1. Add the key to `messages/en.json`
2. Add the Hungarian equivalent to `messages/hu.json`
3. Use `getTranslations("namespace")` in server components or `useTranslations("namespace")` in client components

## Railway Development

GiveGo uses **Railway** for hosting the PostgreSQL database, S3 bucket and the app itself.