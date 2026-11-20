# Experience Nigeria Art Tour – public website

React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui. Served at https://experiencenigeriaart.com.
The admin dashboard is a separate app in `../admin`; see the repository root README.

## Develop

```bash
cp .env.example .env   # fill in the values
npm ci
npm run dev            # http://localhost:8080
```

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | production build to `dist` |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | unit tests (Vitest) |

## Deploy

Vercel project with Root Directory `client`; see `../docs/DEPLOYMENT.md`.
