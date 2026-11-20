# Deployment (nothing is deployed automatically)

## Vercel – two projects, one Git repository
| | Client | Admin |
|---|---|---|
| Project name | Experience Nigeria Art Client | Experience Nigeria Art Admin |
| Root Directory | `client` | `admin` |
| Framework preset | Vite | Vite |
| Install / Build / Output | `npm ci` / `npm run build` / `dist` | `npm ci` / `npm run build` / `dist` |
| Production domain | `experiencenigeriaart.com` (+ `www` redirect) | `admin.experiencenigeriaart.com` |

Each app has its own `vercel.json` with an SPA rewrite (`/(.*)` → `/index.html`), so refreshing a deep
link never 404s, and neither project serves the other's routes.

### Environment variables (Vercel → Project → Settings → Environment Variables)
Client: `VITE_API_URL`, `VITE_RECAPTCHA_SITE_KEY`, `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`,
`VITE_EMAILJS_PUBLIC_KEY`, optional `VITE_SEND_CAPTCHA_TOKEN`.
Admin: `VITE_API_URL`, optional `VITE_ALLOWED_ROLES`.
The old names `VITE_BACKEND_API_URL` / `VITE_BACKEND_IMAGE_URL` still work but should be renamed.
**Set the EmailJS variables before deploying the client** – they are no longer hard-coded, so without them
no notification e-mail is sent (messages are still saved).

## DNS (confirm in the Vercel "Domains" screen – values are provider-specific)
Vercel's current standard records are:
- `experiencenigeriaart.com`  → **A** `76.76.21.21`
- `www.experiencenigeriaart.com` → **CNAME** `cname.vercel-dns.com`
- `admin.experiencenigeriaart.com` → **CNAME** `cname.vercel-dns.com`
- `api.experiencenigeriaart.com` stays as it is today (backend host).
Vercel shows the exact, possibly project-specific, values after you add each domain; use those if they differ.

## Pre-deploy checklist
1. Backend items in `BACKEND_REQUIREMENTS.md` §1–§4 are live (signup closed, CORS for both origins, cookie + CSRF).
2. Deploy **admin** to a preview URL first; add that preview origin to the API CORS list temporarily and test login/logout/CRUD.
3. Deploy **client** preview; submit a test contact message; confirm it appears in the admin Messages page.
4. Promote both to production; add domains; verify HTTPS.
5. Old `/nowhere-home/*` URLs no longer exist on the public site; the public SPA shows its 404 page for them.

## Rollback
Vercel → Deployments → previous deployment → **Promote to Production** (per project, independent).
Rotate nothing unless a secret was exposed (none were found in git history – only browser-visible `VITE_*` values).
