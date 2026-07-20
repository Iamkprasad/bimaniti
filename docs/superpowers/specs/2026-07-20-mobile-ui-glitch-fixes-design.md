# Mobile UI Loading Glitch Fixes

**Date:** 2026-07-20  
**Status:** Design approved  
**Issue:** Mobile loading glitches — flashes, hidden hero text, transparent strips

---

## Problem Summary

Users reported three distinct UI glitches on mobile devices:

1. **Flashes on every page** — visible opacity/visibility transitions during initial load
2. **Top section hero text hidden on mobile** — the BimaNiti hero wordmark, title, and description are invisible for a noticeable duration
3. **Learn chips on transparent strip** — the four topic cards (Motor, Health, Life, Foundations) on the homepage appear to float with no visible background backing

---

## Root Cause Analysis

### Issue 1 & 2: Hero opacity flash

- `style.css:937-946` — `.fade-in` and `.fade-in-up` classes set `opacity: 0` and for hero elements: `transform: translateY(20px)`
- `script.js:159-161` — On `DOMContentLoaded`, hero elements get `.visible` class added, which sets `opacity: 1; transform: translateY(0)`
- On mobile with deferred JS, there's a delay between first paint (elements invisible) and JS execution (elements become visible), causing a visible flash
- Additionally, `style.css:5-9` applies universal transitions to `a, button, .card, .blog-card` etc., causing paint transitions during initial load
- Google Fonts uses `display=swap`, causing FOUT (Flash of Unstyled Text) on slow connections

### Issue 3: Learn chips transparency

- `home.css:126` — `.learn-chip` has `background: var(--bg-primary)` which matches the page body background
- The chips lack any visual separation from the background, making them appear to float on a transparent strip
- Adjacent `.promo-card` uses `background: var(--card-bg)` with a border, providing proper visual separation

---

## Design

### Change 1: Hero starts visible (style.css)

**File:** `style.css:948-956`

Remove the `opacity: 0` and `transform: translateY(20px)` from hero-scoped animations. Hero elements render visible immediately. The JS `.visible` toggle becomes a no-op for hero elements (harmless).

Scroll-triggered `.fade-in`/`.fade-in-up` elements outside `.hero` are unaffected since they lack the `.hero` ancestor scope.

```css
/* Before */
.hero .fade-in { opacity: 0; transition-delay: 0.1s; }
.hero .fade-in-up { opacity: 0; transform: translateY(20px); transition-delay: 0.2s; }
.hero .hero-desc.fade-in { transition-delay: 0.35s; }
.hero .hero-actions.fade-in-up { transition-delay: 0.5s; }

/* After */
.hero .fade-in,
.hero .fade-in-up {
  opacity: 1;
  transform: translateY(0);
}
```

### Change 2: Learn chip background (home.css)

**File:** `home.css:126`

```css
/* Before */
.learn-chip { background: var(--bg-primary); }

/* After */
.learn-chip { background: var(--card-bg); }
```

### Change 3: Font loading strategy (all HTML pages)

Replace `display=swap` with `display=optional` in the Google Fonts URL across all HTML pages.

- `swap`: Immediate render with fallback font, swap when web font loads (causes FOUT)
- `optional`: 100ms block period, never swap after; fast connections get web font, slow connections get fallback without flash

Files to update: `index.html`, `learn.html`, `insurance-guide.html`, `blog.html`, `news.html`, `post.html`, `about.html`, `contact.html`, `archives.html`, `404.html`, `disclaimer.html`, `editorial.html`, `privacy.html`, `terms.html`, `editor.html`, and all `post/*.html` files.

### Change 4: Universal transition scope (style.css, low priority)

Remove broad selectors from the universal transition rule to prevent paint transitions during load:

```css
/* Before */
a, button, .card, .blog-card, .archive-row, .post-card,
.nav-link, .filter-btn, .btn-primary, .btn-outline, .theme-toggle,
.timeline-dot, .share-btn {
  transition: background-color 0.25s ease, border-color 0.2s ease, color 0.15s ease;
}

/* After — keep only navigation/interactive elements, remove content cards */
.nav-link, .filter-btn, .btn-primary, .btn-outline, .theme-toggle, .share-btn {
  transition: background-color 0.25s ease, border-color 0.2s ease, color 0.15s ease;
}
```

This is a non-functional change — transitions on content cards during hover are not noticeable since cards don't change color on hover.

### Change 5: Learn page section gap

Add `padding-bottom: 2rem` to `.page-header` and add a border-top to the tracks section on the learn page for visual breathing room.

---

## What Stays the Same

- Scroll-triggered animations for content below the fold work identically (they use a separate `IntersectionObserver` in `script.js:85-92`)
- Desktop appearance is identical — JS executes fast enough that hero flash wasn't visible there
- Theme toggle, mobile menu, service worker are untouched
- All page content and layout remain identical

---

## Verification

- Load each page on a real mobile device (Chrome DevTools device emulation is acceptable)
- Confirm hero text is visible on first paint with no flash
- Confirm learn chips have distinct card-style background with border
- Confirm no new visual regressions on desktop
- Run `npm run` tests if available, or manually verify no JS console errors
