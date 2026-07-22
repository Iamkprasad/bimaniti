# Fix SVG Logo Dark Mode + Guide Tab Visibility

## Problem
- SVG logo (`svg/logo-main.svg`) has hardcoded dark green background (`#355E3B`) that nearly disappears against the dark navbar (`#141410`) in dark mode
- Current `opacity: .85` does nothing to improve contrast
- "Guide tab" (insurance-guide.html) has same navbar — no separate CSS issue found, just poor contrast

## Solution
Replace `html.dark .logo-img { opacity: .85; }` with a brightness filter + subtle outline:

## Files to change

### 1. `assets/css/nav.css` line 40
**Old:**
```css
html.dark .logo-img { opacity: .85; }
```
**New:**
```css
html.dark .logo-img { filter: brightness(1.3); outline: 1px solid rgba(245,243,238,0.15); }
```

### 2. `assets/css/style.min.css`
Find `html.dark .logo-img{opacity:.85}` and replace with `html.dark .logo-img{filter:brightness(1.3);outline:1px solid rgba(245,243,238,0.15)}`

## What it does
| Property | Effect |
|----------|--------|
| `brightness(1.3)` | Lifts green from `#355E3B` → ~`#468049` (visible on dark) |
| `outline: 1px solid ...` | Subtle light frame around the logo so it doesn't blend into dark background |

## Verification
- Toggle dark mode on any page (index.html, insurance-guide.html, etc.)
- Confirm the green box is clearly visible against dark navbar
- Confirm the cream shapes inside remain prominent
