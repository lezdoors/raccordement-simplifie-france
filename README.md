# Raccordement Connect – Admin, Leads & Stripe

This project runs on Vite + React + Tailwind, with Supabase (Auth, DB, Edge Functions) and Stripe.

Environment and secrets are managed via Supabase Edge Functions (recommended) and your hosting (Vercel) for public URLs.

Required environment (Vercel) for client URLs
- SITE_URL = https://www.raccordement-connect.com (used by functions when Origin not present)

Supabase Edge Function secrets (set in Supabase → Project → Settings → Functions → Secrets)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY (LIVE)
- STRIPE_WEBHOOK_SECRET (LIVE)
- RESEND_API_KEY (if you use email)

Notes about .env
- This project does not use Vite env variables directly. Secrets are read inside Edge Functions.

Implemented flow
1) Auth
- Session initialized with supabase.auth.getSession() and onAuthStateChange in AdminProvider.
- ProtectedRoute guards /admin and shows a 3s timeout fallback instead of infinite spinner.

2) Leads
- Step 1 upserts a lead with status='draft'.
- On subsequent steps, auto-saves. At final step, status becomes 'ready_for_payment'.
- We keep the same wording/structure in the UI.

3) Stripe Checkout
- Edge function create-checkout-session accepts body { lead_id, customer_email, price_id? }.
- If price_id is provided, it’s used. Otherwise it charges the fixed amount (12980 cents).
- success_url = /merci?lead_id=...; cancel_url = /annule?lead_id=...

4) Stripe Webhook
- Edge function stripe-webhook verifies signature and on checkout.session.completed:
  - updates lead payment_status='paid', status='submitted'
  - inserts a row in payments with amount (EUR), payment_intent, session id

Admin dashboard
- Added quick filters: Tous / Non payés / Payés

Manual tests to verify
1. Auth
- Open /admin in incognito → redirected to /login
- Login → /admin loads within 3s; logout and login again

2. Lead draft
- Complete Step 1 only → a row in leads_raccordement with status='draft' exists

3. Full lead + payment
- Complete all steps → redirected to Stripe Checkout
- Pay with a LIVE card → redirected to /merci?lead_id=...
- In Supabase, the same lead has payment_status='paid' and status='submitted' (webhook)

4. Cancel flow
- On Stripe, click cancel → returns to /annule?lead_id=... and lead remains 'ready_for_payment'

5. Admin view
- Lead appears under Payés tab with correct amounts and intent id

Troubleshooting
- Check Edge Function logs in Supabase if anything fails.
- Ensure STRIPE_* secrets are set. Price IDs are optional; using fixed amount fallback.

Links
- Supabase Edge Functions: Project Dashboard → Functions
- Stripe Dashboard: Webhooks & API Keys
