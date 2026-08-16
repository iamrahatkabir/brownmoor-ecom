# Deploying Brownmoor to Vercel

Two apps in one repo, so **two Vercel projects** from the same repository,
told apart by their Root Directory setting.

| Project | Root Directory | Serves |
| --- | --- | --- |
| `brownmoor-backend` | `Backend` | Admin panel + API |
| `brownmoor-storefront` | `Frontend` | The shop |

Deploy the backend first — the storefront needs its URL.

---

## Before you start: the database

**Payload only creates tables automatically in development.** In production it
expects migrations to have been run, and will not alter the schema on boot.

That gives you two options:

**A. Reuse the same Neon database (simplest).** The schema is already there
from local development, so production connects to a database that matches the
code. Fine for launch; it does mean local work and live orders share one
database, so be careful running `seed:clear` once real orders exist.

**B. Separate production database (safer).** Create a second Neon database,
then generate and run migrations:

```bash
cd Backend
npm run payload migrate:create
npm run payload migrate
```

Commit the generated files in `Backend/src/migrations`. Vercel runs `migrate`
on deploy only if you add it to the build command — see the backend build
command note below.

Either way, use Neon's **pooled** connection string (the host contains
`-pooler`). Serverless functions open many short connections and will exhaust a
direct endpoint.

---

## 1. Backend project

1. Vercel → **Add New → Project** → import `iamrahatkabir/brownmoor-ecom`.
2. Set **Root Directory** to `Backend`.
3. Framework preset: Next.js. Leave the build command alone unless you chose
   option B above, in which case set it to:
   `npm run payload migrate && npm run build`
4. Add environment variables:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Neon **pooled** connection string |
| `PAYLOAD_SECRET` | the same value as `Backend/.env` |
| `PAYLOAD_PUBLIC_SERVER_URL` | `https://<backend>.vercel.app` |
| `STOREFRONT_URL` | leave blank for now, filled in step 4 |
| `BLOB_READ_WRITE_TOKEN` | added in step 2 |

`PAYLOAD_SECRET` must match what you used locally. It signs auth tokens, so
changing it invalidates every existing session and password-reset link.

You will not know the deployed URL until after the first deploy. Deploy, copy
the URL, then set `PAYLOAD_PUBLIC_SERVER_URL` and redeploy.

## 2. Blob storage — not optional

Vercel's filesystem is ephemeral. Without this, every product image uploaded
through the admin panel disappears on the next deploy.

1. Vercel → **Storage → Create → Blob**, connect it to the backend project.
2. That adds `BLOB_READ_WRITE_TOKEN` automatically. Redeploy.

The code switches to Blob on its own when the token is present, and falls back
to the local filesystem when it is not — which is why local development needs
no token.

## 3. Storefront project

1. **Add New → Project** → same repository.
2. Set **Root Directory** to `Frontend`.
3. Environment variable:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_PAYLOAD_URL` | `https://<backend>.vercel.app` |

This one variable does two jobs: server-side data fetching, and the
`/api/*` rewrite in `next.config.ts` that proxies cart and checkout calls to
Payload. Get it wrong and products render but the cart silently fails.

## 4. Close the loop

The backend needs to know the storefront's origin for CORS and CSRF, which you
could not know until step 3.

1. Set `STOREFRONT_URL` on the **backend** project to the storefront URL.
2. Redeploy the backend.

Skipping this leaves the cart broken in a way that looks like nothing is
happening — requests are rejected as cross-origin.

## 5. First run

1. Open `https://<backend>.vercel.app/admin` and create the first account. It
   becomes an admin automatically; every account after it defaults to customer.
2. Add products, or run the demo catalogue against production:
   `cd Backend && npm run seed` with `DATABASE_URL` pointed at production.
   Prefer real products — `seed:clear` only ever removes demo data, so demo
   entries left behind are easy to tidy later.
3. In **Globals → Home Page**, upload the hero banner and arrange the product
   sections.

## 6. Check it works

- Storefront home page lists products
- Add to cart increments the header count — this is the one that proves the
  API proxy and CORS are right
- A test order appears under **Orders** in the admin
- An uploaded image survives a redeploy — proves Blob is wired up

---

## Custom domains

Add the domain to the storefront project, then update `STOREFRONT_URL` on the
backend and redeploy. If the backend gets its own domain too, update
`PAYLOAD_PUBLIC_SERVER_URL` on the backend and `NEXT_PUBLIC_PAYLOAD_URL` on the
storefront to match.

## Known rough edges

- **Neon's free tier suspends when idle.** The first request after a pause takes
  a few seconds to wake the database. Not a bug, but it looks like one.
- **No email adapter is configured.** Password resets and order confirmations
  are written to the server log rather than sent. Wire up an adapter such as
  Resend before relying on either.
- **Orders are not yet sent to Steadfast.** Every order is read from the admin
  and entered into the courier by hand.
