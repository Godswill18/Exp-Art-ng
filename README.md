# Experience Nigeria Art Tour

Two **independent** React + Vite applications that share nothing but the REST API.

```
.
├── client/   Public website            → https://experiencenigeriaart.com
├── admin/    Admin dashboard (CMS)     → https://admin.experiencenigeriaart.com
├── docs/     Backend requirements, deployment, DNS
└── .github/workflows/ci.yml   typecheck + lint + test + build for both apps
```

The backend (`https://api.experiencenigeriaart.com`) lives in a separate repository.
The admin dashboard is never imported into, embedded in, or bundled with the public site.
There are no cross-application imports; each app has its own `package.json`, lockfile,
dependency tree, environment file and Vercel config.

## Develop

```bash
cd client && cp .env.example .env && npm ci && npm run dev    # http://localhost:8080
cd admin  && cp .env.example .env && npm ci && npm run dev    # http://localhost:8081
```

Per app: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`.

## Documents

- [docs/BACKEND_REQUIREMENTS.md](docs/BACKEND_REQUIREMENTS.md) – changes the API **must** make (CORS, cookies, CSRF, signup, reCAPTCHA, dashboard/transactions/booking endpoints).
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) – two Vercel projects, DNS, environment variables, rollback.
