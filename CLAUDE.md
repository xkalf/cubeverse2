# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Web App (Frontend)
- `bun dev` - Start development server on port 3001
- `bun build` - Build for production
- `bun serve` - Preview production build
- `bun deploy` - Build and deploy to Cloudflare

### Server (Backend)
- `bun dev` - Start development server on port 3000 using Wrangler
- `bun deploy` - Deploy to Cloudflare Workers
- `bun build` - Dry run deployment build
- `bun check-types` - Run TypeScript type checking

### Database Operations
- `bun db:push` - Push schema changes to database
- `bun db:studio` - Open Drizzle Studio
- `bun db:generate` - Generate migration files
- `bun db:migrate` - Run migrations

## Architecture Overview

This is a full-stack TypeScript application with separate frontend and backend services deployed on Cloudflare.

### Tech Stack
- **Frontend**: React 19 + TanStack Router + TanStack Query + shadcn/ui + Tailwind CSS
- **Backend**: Hono + ORPC + Better Auth + Drizzle ORM
- **Database**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages (frontend) + Cloudflare Workers (backend)

### Project Structure
- `apps/web/` - Frontend React application
- `apps/server/` - Backend Hono server with ORPC API

### API Communication
The frontend communicates with the backend through **ORPC** (Open RPC), which provides type-safe RPC calls:

- Server defines procedures in `apps/server/src/routers/`
- Client imports types and creates typed client in `apps/web/src/utils/orpc.ts`
- TanStack Query integration via `orpc.procedure.mutationOptions()` and `orpc.procedure.queryOptions()`

### Authentication
Uses **Better Auth** with email/password authentication:
- Server: `apps/server/src/lib/auth.ts`
- Database schema: `apps/server/src/db/schema/auth.ts`
- Routes: `/api/auth/**`

### Database Schema
Located in `apps/server/src/db/schema/` with:
- Drizzle ORM for schema definition and queries
- Custom validation factory for Zod schemas
- Snake case database columns, camelCase TypeScript

### Frontend Routing
Uses **TanStack Router** with file-based routing:
- Route files in `apps/web/src/routes/`
- Type-safe routing with context injection
- Loaders for data prefetching

### Component Architecture
- **shadcn/ui** components in `apps/web/src/components/ui/`
- Feature-specific components in route directories (e.g., `apps/web/src/routes/admin/teacher/components/`)
- Form handling with **React Hook Form** + Zod validation

### Environment Variables
Backend requires Cloudflare-specific environment variables:
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_DATABASE_ID`
- `CLOUDFLARE_D1_TOKEN`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `CORS_ORIGIN`

### API Endpoints
- `/rpc` - ORPC procedures
- `/api` - OpenAPI endpoints
- `/api/auth/**` - Better Auth endpoints

### Type Safety
- Shared types through ORPC client/server contracts
- Database types generated from Drizzle schema
- Form validation with Zod schemas matched to database schema