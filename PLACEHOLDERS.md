# bimaNiti — Setup & Placeholder Checklist

This document lists every placeholder, missing config, and required action to make the repo fully functional.

---

## 1. 🔴 Security — `.env` in `.gitignore`

**Fixed:** `.env` was missing from `.gitignore`. Now added.

**Action:** `NONE` — already committed with this fix.

**Never commit `.env` to GitHub.** It contains your Supabase secrets.

---

## 2. ⏳ Supabase Project — Create & Configure

No Supabase project has been created yet. The app will not work until this is done.

### Steps

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Copy your project URL and anon key from **Project Settings → API**.
3. Create a `.env` file in the repo root with:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

> `.env` is now gitignored — it will NOT be committed.

---

## 3. ⏳ Database Schema — Run SQL

File: `supabase/schema.sql`

### Actions

1. In Supabase Dashboard, go to **SQL Editor**.
2. Open `supabase/schema.sql` from this repo.
3. Run the entire script. It creates:
   - `blogs` table
   - `news` table
   - `profiles` table (linked to `auth.users`)
   - Indexes on category, status, published_date, slug
   - Row Level Security policies
   - Triggers for `updated_at` and auto-profile creation

---

## 4. ⏳ Supabase Auth — Enable & Create Admin User

### Steps

1. In Supabase Dashboard → **Authentication → Providers**.
2. Ensure **Email** provider is enabled (it is by default). Confirm **Confirm email** is ON or OFF as you prefer.
3. In **Authentication → Users**, click **Add User**:
   - Email: (your admin email)
   - Password: (choose a strong password)
4. The `handle_new_user()` trigger in the schema will auto-create a row in `profiles` with `role = 'admin'`.

**First user is now ready.** Go to `/admin/login` on the site and sign in.

---

## 5. 🔴 Placeholder Email — Update Contact Form

File: `src/pages/Contact.jsx:23`

The contact form opens a `mailto:` link. Currently uses a placeholder:

```js
`mailto:prasad.kulal@example.com?subject=...`
```

### Action

Replace `prasad.kulal@example.com` with your real email address.

---

## 6. ⏳ Seed Data — Initial Content

The database is empty. The site will show "No blog posts found" / "No news items found" until content exists.

### Option A: Manual via Admin Dashboard

Navigate to `/admin/editor` and create posts through the UI.

### Option B: SQL Seed (from schema.sql)

Uncomment and run the sample seed in `supabase/schema.sql` (lines 172–185), then modify for your content.

---

## 7. 🔴 Edge Function — Placeholder (Optional)

File: `supabase/functions/fetch-news/index.ts`

The news automation edge function returns a placeholder response. To use it:

1. Deploy to Supabase: `supabase functions deploy fetch-news`
2. Set environment variables in Supabase Dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Implement actual news-fetching logic (search API, AI content generation, etc.)

Not required for basic site functionality.

---

## 8. ✅ Already Done

| Item | Status |
|------|--------|
| `package.json` name = `bimaniti` | ✅ |
| Git repo initialized | ✅ |
| Remote `origin` set to `github.com/Iamkprasad/bimaniti.git` | ✅ |
| Initial commit pushed | ✅ |
| Project flattened (no nested `insurenews-react/`) | ✅ |
| `.env` added to `.gitignore` | ✅ Now |
| Admin routes (`/admin/*`) wired | ✅ |
| `ProtectedRoute` with auth check | ✅ |
| `authService` (login/logout/getUser) | ✅ |
| CRUD services (blog/news) | ✅ |
| RLS policies in schema | ✅ |
| Branding consistent (Prasad Chandra Kulal) | ✅ |
| LinkedIn profile links (`/in/prasadkulal/`) | ✅ |

---

## Quick Start (After Supabase Setup)

```bash
npm install
npm run dev
# Opens at http://localhost:5173
# Admin at http://localhost:5173/admin/login
```
