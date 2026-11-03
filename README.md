# TeaShell Soap — Landing Page + Admin Panel (Next.js)

The admin panel and backend are the same as the Ayaat/Velour perfume shop (`perf-2/purfume-main`);
only the landing page, `data/site.js` and the landing text schema in `lib/content.js` are TeaShell-specific.

## Run

```bash
npm install
npm run dev          # http://localhost:3000
```

- Landing page: `/`
- Admin panel: `/admin` — password is the `ADMIN_PASSWORD` environment variable.

`vercel link` wrote `.env.local` with the live Neon `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN`, so local runs use
the **live** database and image store. Add `ADMIN_PASSWORD=...` to `.env.local` to log in locally.

## Admin features

Dashboard (live clock, calendar, ranges), orders (status, edit, notes, CSV, bulk courier), manual phone orders,
incomplete orders, products/packages, landing page text editor, banners, couriers (Steadfast, Pathao, CarryBee,
auto-send, auto status sync), fake-order protection (phone/IP limits, block list, BD Courier history),
Telegram notifications, WhatsApp confirm messages, Pixel/CAPI/GTM tracking, site settings (logo, voice, delivery).

## Deploy (Vercel)

Linked project `teashellsoap`, Neon Postgres (`DATABASE_URL`) and Blob store (`BLOB_READ_WRITE_TOKEN`) are connected.
Env vars: `ADMIN_PASSWORD`, `CRON_SECRET` (daily Steadfast sync), optional `TELEGRAM_BOT_TOKEN` / `TELEGRAM_SECRET`.
Every `git push` to `main` redeploys.

## Images

`public/images/*` were cut from `design-reference.png` by `npm run crop-assets`. Replace them from the admin panel
(Banners, Products, Landing text).
