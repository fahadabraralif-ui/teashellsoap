# TeaShell Soap — Landing Page + Admin Panel (Next.js)

## Run

```bash
npm install
npm run dev          # http://localhost:3000
# production
npm run build && npm start
```

- Landing page: `/`
- Admin panel: `/admin` — default password **admin123** (or set `ADMIN_PASSWORD` in `.env.local` before first run). Change it from **Admin → সিকিউরিটি ও পাসওয়ার্ড**.

## Data

All orders, settings and uploaded images live in `./data` (`db.json` + `uploads/`), or in `DATA_DIR` if set.
Back this folder up. It needs a host with a persistent disk (VPS, cPanel Node app, Railway/Render with a volume).
Vercel's filesystem is read-only/ephemeral, so it is not suitable without swapping `lib/db.ts` to a database.

## Admin features

- Dashboard: today / month / total sales, 7-day chart, status breakdown, stock, delivery success rate
- Orders: status tabs, search, date filter, inline status change, edit, manual order, bulk actions, CSV export, printable invoices, per-phone order history (fake-order check), call/WhatsApp links
- Incomplete orders: forms where a phone was typed but no order was placed; convert to an order in one click
- Product & delivery: price, regular price, stock (auto-adjusted), max quantity, delivery charges, free-delivery threshold
- Landing content: headlines, images (upload), notice bar, phone/WhatsApp, thank-you text
- Reviews: add / edit / reorder / delete
- Marketing: Meta Pixel (PageView, InitiateCheckout, Purchase), Conversions API with event dedup, GTM
- Courier: Steadfast API — send orders, track status, auto-send on confirm, balance check
- Security: duplicate-order window, blocked phones/IPs, login rate limit, password change

## Images

`public/images/*` were cut from `design-reference.png` by `npm run crop-assets`.
Replace them anytime from the admin panel with original high-resolution photos.
