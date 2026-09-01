# Rising Without Losing Yourself — Official Website

Full-stack site for Brenda Chebet Koech's leadership memoir: public book site
with a direct M-Pesa purchase flow, plus an authenticated admin dashboard for
order management.

**Stack:** React (Vite) + TypeScript + Tailwind · Supabase (Postgres, Auth,
Edge Functions, Realtime) · M-Pesa STK push via Lipwa Hub.

## 1. Install

```bash
npm install
```

## 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the migration in `supabase/migrations/0001_init.sql` (SQL editor, or
   `supabase db push` if you're using the CLI and have linked the project).
3. Enable Realtime for the `orders` table if the migration's
   `alter publication supabase_realtime add table orders;` line didn't apply
   automatically (Database → Replication in the dashboard).
4. Create your admin login: **Authentication → Users → Add user** (email +
   password, no public signup is exposed). Then, in the SQL editor:
   ```sql
   insert into admins (user_id) values ('af0b9767-660c-49c0-a705-49ffae77b6d2>');
   ```
   Only rows in `admins` can read or write `orders` — everyone else (the
   anon/public key) has zero direct table access, by design.

## 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your Supabase URL + anon key for
the frontend:

```bash
cp .env.example .env
```

For the Edge Functions, set the **secret** values (never put these in the
frontend `.env`):

```bash
supabase secrets set \
  SUPABASE_URL=https://xptzwecxiwjwlubnxuvo.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdHp3ZWN4aXdqd2x1Ym54dXZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODIwMzY1NSwiZXhwIjoyMTAzNzc5NjU1fQ.SJaEaoVG4lfA_XL-YamXBgbXOPLyc-q88y68sQHj1to \
  LIPWA_API_KEY=lp_1f2f0402e651596d1afb763bb9c46ff4131a458e \
  LIPWA_CHANNEL_ID=CH_AFB198DB \
  LIPWA_CALLBACK_URL=https://xptzwecxiwjwlubnxuvo.functions.supabase.co/lipwa-callback
```

## 4. Deploy the Edge Functions

```bash
supabase functions deploy create-order
supabase functions deploy lipwa-callback
supabase functions deploy order-status
```

Point your Lipwa Hub dashboard's webhook/callback URL at the deployed
`lipwa-callback` function.

## 5. Run locally / build

```bash
npm run dev      # local dev server
npm run build     # production build to dist/
```

The admin dashboard lives at `/admin` — sign in with the account you added
to the `admins` table above.

## What's beyond the base spec

- **`order-status` Edge Function**: the build spec's API contract describes a
  `GET /api/status` fallback-polling endpoint; this is implemented as its own
  function so the storefront can poll order status without any direct table
  access, and it also checks Lipwa's transaction-status API directly if a
  payment has been stuck in `PAYMENT_INITIATED` for a while.
- **`admins` table + RLS**: the spec calls for "admin-only read/write" — this
  is enforced with a small allowlist table rather than a role flag, so admin
  access is explicit and auditable.
- **Realtime on the admin dashboard**: order rows update live in the table as
  the webhook or another admin changes them, on top of the initial fetch.
- **Till-fallback manual orders**: submitted through the same `create-order`
  function (with `paymentMethod: "till_manual"`) so they land in the same
  `orders` table with `payment_method = 'till_manual'`, ready for an admin to
  reconcile against `PAID` — an `mpesa_code_submitted` column was added for
  this (never used to auto-mark an order PAID, per the spec's rule that only
  a verified callback can do that).

## Notes

- All customer-facing writes go through Edge Functions using the service
  role key — the public anon key has no direct `orders` table access.
- Only the `lipwa-callback` webhook (with an amount check) can mark an order
  `PAID`. A customer-submitted M-Pesa code is stored for reference only.
- Phone numbers are normalized and validated server-side in `create-order`,
  independent of the lighter client-side check used for instant form
  feedback.
