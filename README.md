# Fidelio

Fidelio is a modern personal finance & cashflow tracking application. It lets users record and analyse income and expense transactions (one‑off or recurring), schedule future cash movements, and maintain a clear snapshot of their financial runway. Recurring rules (weekly, monthly, yearly, specific day of week/month, first/last business day) and optional start/finish windows add rich flexibility. A responsive Vue frontend consumes a typed TypeScript/Express API powered by PostgreSQL & Prisma. CI/CD builds and deploys the backend in Docker images to staging and production via GitHub Actions.

---

## Key Features

-   User accounts (email, optional username, profile image) with JWT-based authentication
-   Typed contract-first API using ts-rest + Zod for request/response validation
-   Transaction engine supporting: income vs expense, recurrence, scheduling windows
-   Strongly typed data layer via Prisma + PostgreSQL
-   Firebase integration (storage / potential future auth extensions)
-   Email templating & test harness (Nodemailer)
-   Modern Vue 3 + Vite + Pinia frontend with component auto-imports & Storybook
-   OpenAPI / contract generation for frontend API client
-   CI/CD pipeline (GitHub Actions) building & pushing GHCR Docker images
-   Zero-downtime remote deployment using docker compose on a VPS (production & staging)

---

## Tech Stack

**Backend**

-   Node.js + TypeScript
-   Express + ts-rest (`@ts-rest/core`, `@ts-rest/express`) for contract-driven endpoints
-   Zod for schema validation & safety
-   Prisma ORM (`@prisma/client`) + PostgreSQL
-   JWT auth (`jsonwebtoken`) & custom auth contract (`@stelan/auth-contract`)
-   Firebase SDK integration
-   Nodemailer for emails
-   date-fns for date handling

**Frontend**

-   Vue 3 + Vite
-   Pinia (state), Vue Router (routing)
-   Tailwind (via PostCSS) + utility libraries (clsx, tailwind-merge)
-   Component auto-import (unplugin-vue-components) & icon packs (lucide, mdi)
-   Storybook + Chromatic for UI development/review
-   Vitest + Playwright for unit/E2E testing
-   OpenAPI generator & ts-rest client for typed API calls
-   PWA support (vite-plugin-pwa)

**Tooling & DevEx**

-   Type safety (`vue-tsc`, `typescript`)
-   Docker (backend + PostgreSQL) & docker-compose
-   GitHub Actions (build, push, deploy workflow)

---

## Environments

Branching & domains (see `ENVIRONMENTS.md`):

| Environment | Git Branch                     | Domains                                                |
| ----------- | ------------------------------ | ------------------------------------------------------ |
| Production  | `main`                         | `fidelio.club`, `www.fidelio.club`, `api.fidelio.club` |
| Staging     | `staging`                      | `staging.fidelio.club`, `api.staging.fidelio.club`     |
| Development | feature branches off `staging` | `localhost:5173`                                       |

Runtime selection via `NODE_ENV` (development | staging | production).

---

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/deploy.yml`

-   Triggers on pushes to `main` and `staging` affecting `backend/**`.
-   Builds backend Docker image and pushes to GHCR (`ghcr.io/<repo>/backend:<tag>`).
-   Securely copies `docker-compose.yml` to VPS (different paths for staging vs production).
-   SSH deploy step exports secrets & variables then runs `docker compose pull`, `up -d`, and prunes unused images.
-   Separate jobs for production (`main`) and staging (`staging`).

---

## Roadmap / Potential Enhancements

-   Financial analytics dashboards & forecasting
-   Notifications for upcoming recurring transactions
-   Enhanced test coverage (backend unit/integration)
