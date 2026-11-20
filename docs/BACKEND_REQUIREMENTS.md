# Backend requirements

The frontends cannot enforce security. **Everything below must be implemented and tested in the
API repository.** Nothing here has been verified against the live API from this repo: items marked
*verify* are unknown, items marked *required* are known gaps.

## 1. Administrator provisioning (required)
- The old in-site page `/nowhere-home/try-to-know-me` called `POST /api/auth/signup`. The admin app no
  longer contains any signup UI, **but the endpoint may still be reachable by anyone**.
- Disable or protect `POST /api/auth/signup`: require an authenticated **Super Admin**, or remove it and
  create admins via a CLI/seed script. Verify with `curl -X POST .../api/auth/signup` from a logged-out client.

## 2. Authentication & sessions
- *Verify:* `POST /api/auth/login` sets an **HttpOnly, Secure, SameSite** cookie. The frontends rely only
  on the cookie (`credentials: "include"`) and no longer store or send any token.
- `GET /api/auth/me` → `200 { _id|id, email, name?, role? }` for a valid session, `401` otherwise.
- `POST /api/auth/logout` must clear the cookie server-side.
- Cookie scope: issue it for the **API host only** (no `Domain=` attribute) so it is not shared across
  every subdomain. Because `admin.` and `api.` are same-site (same registrable domain), `SameSite=Lax` or
  `Strict` works; `SameSite=None` is only needed for genuinely cross-site setups.
- Every `/api/events|gallery|schedule|contacts` **write** and every admin **read** (`get-events`,
  `get-all-posts`, `get-all-schedule`, `get-all-contacts`) must verify the session and the admin **role**
  server-side. The UI role check (`VITE_ALLOWED_ROLES`) is cosmetic.

## 3. CORS (required)
Explicit allow-list, credentialed:
```
Access-Control-Allow-Origin: https://experiencenigeriaart.com   (echo the request Origin only if allow-listed)
                             https://admin.experiencenigeriaart.com
                             (+ https://www.experiencenigeriaart.com only if www is actually served)
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
Access-Control-Allow-Headers: Content-Type
Vary: Origin
```
No `*` with credentials. Answer `OPTIONS` preflights with 204. Allow-list `http://localhost:8080`/`8081` in development only.

## 4. CSRF (required for cookie auth)
State-changing requests (POST/PUT/PATCH/DELETE) authenticated by cookie need CSRF protection:
`SameSite` cookies **plus** an Origin/Referer check against the allow-list above (reject others), or a
double-submit token. Tell the frontend team if a custom header/token is chosen so it can be added to
`admin/src/lib/api.ts`.

## 5. Contact form & reCAPTCHA (required)
- `POST /api/contacts/create-contact` currently receives `{ name, email, message }` (no `subject`).
  The API is the source of truth: save first, respond `201`.
- Verify the reCAPTCHA response server-side with the **secret key** (kept only in backend env).
  The client can already send it: set `VITE_SEND_CAPTCHA_TOKEN=true` in `client` → body gains
  `captchaToken`. Do not enable the flag before the backend accepts the field.
- *Decide:* who sends the notification e-mail. The client currently sends a best-effort EmailJS
  notification **after** the API confirms the save. If the backend sends mail, remove the EmailJS vars
  from the client to avoid duplicates.
- Add rate limiting per IP for this public endpoint.

## 6. Dashboard & transactions (required – nothing is faked in the UI)
The dashboard shows only counts derived from existing list endpoints. Missing:
- `GET /api/admin/stats` → `{ totalEvents, activeEvents, galleryItems, contactMessages, unreadMessages, revenue?: { currency: "NGN", total }, ticketsSold? }`
- `GET /api/transactions?status=&q=&page=&limit=` → `{ transactions: [{ _id, reference, customerName, customerEmail, amount, currency, status: "success"|"pending"|"failed", eventId, createdAt }], page, totalPages }`
- `GET /api/transactions/:id`

## 7. Ticket booking (required before online sales)
No booking endpoint exists, so the public site routes visitors to the contact form
("Enquire to Reserve") and never simulates a reservation. Needed:
- `POST /api/bookings` `{ eventId, ticketType, quantity, name, email, phone }` → `201 { booking: { _id, reference, status: "pending_payment" }, paymentUrl? }`
- Server-side availability check, idempotency key to prevent duplicate reservations, price computed on the server.
- `GET /api/bookings/:reference` for confirmation; webhook from the payment provider to confirm payment.
- Event capacity/remaining fields on `GET /api/events/get-user-events`.

## 8. Other
- Admin message `isRead` + `PATCH /api/contacts/:id/read` (the UI already renders unread state if present).
- Return JSON errors `{ message }` for 4xx; never include stack traces in 5xx bodies (the UI ignores 5xx text anyway).
- Serve uploaded images over HTTPS with long cache headers; return paths consistently
  (either absolute URLs or relative paths – both are handled by the frontends' image resolver).
