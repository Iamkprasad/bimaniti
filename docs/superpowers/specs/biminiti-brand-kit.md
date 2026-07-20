# BimaNiti — Brand Identity System

> Generated: 2026-07-20
> Source: [brandkit skill](../../../../../../../../Downloads/brandkit-1.0.0/SKILL.md)

---

## 1. Brand Strategy

### Category
Insurance market analysis platform — editorial intelligence for India's insurance sector.

### Audience
- Insurance professionals (actuaries, underwriters, product managers)
- IRDAI compliance officers and regulatory watchers
- Policyholders and informed consumers
- Market analysts and financial journalists
- Investors tracking insurer performance

### Core Metaphor
**Clarity through analysis.** A lens that reveals what is hidden — distilling complex regulations, financial results, and market structures into readable insight.

The name itself encodes this duality:
- **Bima** (बीमा) = Insurance → protection, safety
- **Niti** (नीति) = Policy / Analysis → principle, method, discernment

Together: **the disciplined study of protection.**

### Emotional Promise
Confidence through understanding. When insurance is clear, decisions become certain.

### Cultural Position
India's insurance sector is complex, opaque, and rapidly evolving. BimaNiti stands as an independent interpreter — not a seller, not a regulator, but a trusted third voice that makes the system legible.

### Trust Level
High. Independent, no sponsored content, no affiliate links, research-led, every assertion traces back to a primary source (IRDAI circular, financial filing, court ruling).

### Visual World
Warm editorial calm. Paper-toned backgrounds, forest-green accent, generous whitespace, clean serif + sans typography. Feels like a premium print journal translated to screen. Green evokes growth, life, trust — not the cold blue of corporate finance.

### What the Brand Avoids
- Stock imagery of handshakes, skyscrapers, graphs
- Generic blue corporate palette
- Fintech startup clichés (neon, gradients, illustrations of people with laptops)
- Buzzwords ("revolutionize", "disrupt", "next-gen")
- Selling or lead-gen pressure

### Brand Personality
| Trait | Expression |
|---|---|
| **Authoritative** | Research-led, sourced, data-backed |
| **Clear** | Plain-language, no jargon for its own sake |
| **Calm** | Unhurried design, generous whitespace, measured voice |
| **Independent** | No affiliations, transparent methodology |
| **Refined** | Typography-driven, restrained, premium feel |
| **Indian** | Context-rooted, culturally aware, not generic |

---

## 2. Logo System

### Primary Wordmark

```
 __   __                         __   __
|  | |  |  /XXX\  /XXX\  /XXX\  |  | |  |
|  | |  |  \XXX/  \XXX/  \XXX/  |  | |  |
|  |_|  |     X      X      X    |  |_|  |
|       |     X      X      X    |       |
|       |   /XXX\  /XXX\  /XXX\  |       |
|_______|   \XXX/  \XXX/  \XXX/  |_______|

"Bima" (sans-serif, weight 600, dark) + "Niti" (serif, weight 500, green)
Tagline: "INSURANCE & MARKET ANALYSIS" (sans, weight 400, 8.5px, letter-spaced 2.5px)
```

**Construction:**
- ViewBox: `0 0 250 58`
- `Bima`: Outfit (sans), weight 600, 34px, `#1a1a1a` (light) / `#e8e4dc` (dark)
- `Niti`: Lora (serif), weight 500, 34px, `#4a6741` (light) / `#8aaa7a` (dark)
- Tagline: Outfit, weight 400, 8.5px, `#6a6a6a`, letter-spacing 2.5px
- Baseline alignment: both "Bima" and "Niti" sit on the same baseline

**Meaning:** The sans/serif contrast embodies the brand's duality — modern analysis applied to a traditional domain. The green on "Niti" signals that analysis (not the brand itself) is the active, living element.

### Logo Variants

| Variant | Usage | File |
|---|---|---|
| Full wordmark (dark text) | Light backgrounds, light mode | Inline SVG in all HTML |
| Full wordmark (light text) | Dark backgrounds, dark mode | `.dark` CSS variables |
| Monochrome (all dark) | Single-color applications, favicon | CSS `fill: currentColor` |
| Monochrome (all white) | Dark backgrounds, no color printing | CSS `.dark` monochrome |
| Tagline lockup | OG images, hero, footer | Default SVG with tagline |
| No-tagline | Navigation bar, tight spaces | SVG with text elements only |

### Logo Proportions

```
        ┌─────────────────────────────────────┐
        │  BimaNiti                           │  ← wordmark
        │  INSURANCE & MARKET ANALYSIS        │  ← tagline
        └─────────────────────────────────────┘
        ←---------- 250 units ---------------→

Minimum width:  120px (wordmark only)
Minimum width:  180px (with tagline)
Clear space:    equal to the height of "Bima" on all sides
```

### BN Monogram (Supplementary Mark)

A proposed standalone symbol for favicon, app icon, social avatar, and pattern use:

**Concept:** A stylized `B` and `N` interlocked into a shield-like form with a circular negative space at the centre — representing the lens of analysis within a protective boundary.

```
    ┌─────────────────┐
    │  ╔═══╗  ╔═══╗  │
    │  ║ B ║  ║ N ║  │
    │  ╚═══╝  ╚═══╝  │
    │     ◉ lens      │
    └─────────────────┘
```

**Construction geometry:**
- Outer boundary: shield outline (2:3 ratio)
- `B`: left half — vertical spine + two curves
- `N`: right half — diagonal connecting top-left to bottom-right
- The crossbar of `B` extends to become the top of `N`
- Centre: circular negative space (the lens/aperture)
- Corner radius: 2px

**Usage:**
- Favicon (SVG, 32×32)
- Social media avatar (square crop)
- Mobile app icon (iOS/Android)
- Section dividers and decorative elements
- Loading state / splash screen

### Favicon

- Current: SVG favicon using the full logo at `logo.svg`
- Proposed future: BN monogram for better recognition at 16-32px
- PWA manifest: should include 192×192 and 512×512 versions

---

## 3. Color System

### Light Mode Palette

```
PRIMARY BACKGROUND    #f5f3ef   ████████████████████  Warm cream/ivory
SECONDARY BG         #ede9e3   ████████████████     Slightly darker cream
CARD BACKGROUND      #ffffff   ██████████████████████  White

TEXT PRIMARY         #1a1a1a   ████████  Near black (headings)
TEXT SECONDARY       #4a4a4a   ████████  Body text
TEXT MUTED           #6a6a6a   ████████  Metadata, secondary info

ACCENT               #4a6741   ████████  Forest/moss green
ACCENT HOVER         #3a5232   ████████  Darker green

BORDER               #d6d0c8   ████████  Warm light gray
ALERT                #b94040   ████████  Breaking news, errors
```

### Dark Mode Palette

```
PRIMARY BACKGROUND    #141410   ████████████████████  Very dark charcoal
SECONDARY BG         #1c1c18   ████████████████     Slightly lighter
CARD BACKGROUND      #1e1e1a   ██████████████████████  Dark card

TEXT PRIMARY         #e8e4dc   ████████  Warm off-white
TEXT SECONDARY       #c0bab0   ████████  Warm light gray
TEXT MUTED           #8a8a84   ████████  Medium warm gray

ACCENT               #8aaa7a   ████████  Sage/moss green (lighter)
ACCENT HOVER         #a0be90   ████████  Even lighter green

BORDER               #2e2e28   ████████  Dark border
ALERT                #b94040   ████████  (same — red maintains urgency)
```

### Semantic Color Mapping

| Token | Usage | Light | Dark |
|---|---|---|---|
| `--bg-primary` | Page background | `#f5f3ef` | `#141410` |
| `--bg-secondary` | Section alt, code blocks | `#ede9e3` | `#1c1c18` |
| `--text-primary` | Headings, nav | `#1a1a1a` | `#e8e4dc` |
| `--text-secondary` | Body copy | `#4a4a4a` | `#c0bab0` |
| `--text-muted` | Meta, dates, captions | `#6a6a6a` | `#8a8a84` |
| `--accent` | Links, buttons, dividers, borders | `#4a6741` | `#8aaa7a` |
| `--accent-hover` | Hover states | `#3a5232` | `#a0be90` |
| `--border` | Rules, card outlines, table borders | `#d6d0c8` | `#2e2e28` |
| `--card-bg` | Cards, containers, nav dropdown | `#ffffff` | `#1e1e1a` |
| `--nav-bg` | Sticky nav background | `#f5f3ef` | `#141410` |
| `--alert` | Breaking news, error, critical | `#b94040` | `#b94040` |

### Category Tag Colors

| Category | Background | Text | Meaning |
|---|---|---|---|
| Life | `#EAF0F5` | `#1A4A6E` | Stability, blue |
| General | `#EAF5EA` | `#1A4A2A` | Growth, green |
| Health | `#F5EAF0` | `#6E1A4A` | Care, rose |
| Motor | `#FFF3E0` | `#7A4000` | Movement, amber |
| IRDAI | `#F0EDF5` | `#3A1A6E` | Authority, purple |
| Breaking | `#FDECEA` | `#b94040` | Urgency, red |

### Accessibility

- **Accent on backgrounds:** `#4a6741` on `#f5f3ef` = ratio ~5.2:1 (passes AA for large text, fails AA for small text — acceptable for accent-only usage)
- **Body text:** `#4a4a4a` on `#f5f3ef` = ratio ~9.1:1 (AAA)
- **Primary text:** `#1a1a1a` on `#f5f3ef` = ratio ~16.5:1 (AAA)
- **Dark mode body:** `#c0bab0` on `#141410` = ratio ~11.2:1 (AAA)
- **Link text:** accent green used for links — supplement with underlines for colorblind users

---

## 4. Typography System

### Font Pairing

| Role | Font | CSS Variable | Fallback |
|---|---|---|---|
| Display / Headings | Lora | `--font-display` | Georgia, serif |
| Body / UI | Outfit | `--font-body` | system-ui, sans-serif |

**Why this pairing:**
- **Lora** brings editorial gravitas — it has a calligraphic warmth that keeps long-form reading inviting, not cold
- **Outfit** is clean and geometric without being robotic — it handles UI, navigation, and metadata with precision
- The contrast between them mirrors the brand's core duality: traditional domain + modern analysis

### Loading Strategy

```html
<link href="https://fonts.googleapis.com/css2?
  family=Lora:ital,wght@0,400;0,500;1,400&
  family=Outfit:wght@300;400;500;600&
  display=optional"
  rel="stylesheet">
```

- `display=optional` — allows a 100ms swap window, then falls back to system fonts if not loaded
- Preconnect to both `fonts.googleapis.com` and `fonts.gstatic.com`
- No variable fonts — explicit weights only for consistent rendering

### Type Scale

| Element | Family | Weight | Size (mobile → desktop) | Line Height | Other |
|---|---|---|---|---|---|
| Hero heading | Lora | 400 | 2.75rem → 3.5rem | 1.2 | |
| Page heading (h1) | Lora | 400 | 2rem → 2.25rem | 1.2 | |
| Section heading (h2) | Lora | 400 | 1.5rem → 1.75rem | 1.25 | |
| Card heading (h3) | Lora | 400 | 1.2rem | 1.3 | |
| Hero eyebrow | Outfit | 600 | 11px | | uppercase, letter-spacing 0.14em |
| Section eyebrow | Outfit | 600 | 11px | | uppercase, letter-spacing 0.14em |
| Body copy | Outfit | 300 | 16px | 1.6 (articles: 1.85) | |
| Nav link | Outfit | 400 / 500 active | 13px | | |
| Tag pill | Outfit | 600 | 10px | | uppercase, letter-spacing 0.08em |
| Blockquote | Lora | 400 italic | 1.25rem → 1.375rem | 1.5 | |
| Drop cap | Lora | 500 | 52px | | |
| Footer | Outfit | 300 | 0.8125rem (13px) | | |
| Meta / date | Outfit | 400 | 0.8125rem | | |

### Typography Rules

1. Never use Lora for UI elements (buttons, nav, tags, forms)
2. Never use Outfit for pull quotes or display headings
3. Hero headings may use Lora italic for emphasis
4. Body copy weight 300 keeps long-form reading light and comfortable at 16px
5. Letter-spacing is reserved for uppercase short strings (eyebrows, tags, tagline)
6. No justified text — left-aligned only
7. No hyphenation in headings

---

## 5. Visual Language

### Texture & Atmosphere

The brand lives in a sensory space between paper and screen:

- **Warm paper texture** — the `#f5f3ef` background reads as uncoated cream stock, not flat white
- **Generous whitespace** — content breathes with 1.5-2rem padding, wide gutters, and 1160px max width
- **Subtle green line accents** — 1-2px accent borders, left-divider lines, and horizontal rules provide structure without visual noise
- **Dot pattern (hero)** — a repeating grid of small dots at 1% opacity creates a topographic/data-point texture in the hero section, evoking market data and analytical depth

### Dot Pattern Specification

```
Hero dot pattern:
- Single dot: 2px × 2px, filled #4a6741
- Grid spacing: 48px
- Opacity: 1%
- Attached to hero section only (not full page)
- Position: absolute, covering entire hero, pointer-events: none
- Intent: evokes data points, market grids, analytical depth — not decoration
```

### Iconography

- **No icon library** — the brand intentionally avoids icon sets
- Where icons are needed (social links, RSS, theme toggle), use:
  - Minimal inline SVGs with `currentColor` fill
  - 16-20px viewBox
  - Stroke weight 1.5-2px
  - Rounded caps but sharp line joins
- Avoid filled icons, multi-color icons, or branded social media colors

### Image Direction

**Style:** Editorial illustration or editorial photograph — aligned to The Economist / Mint newspaper aesthetic.

**Rules:**
- No company logos, no brand names, no trademarks in images
- No generic stock people smiling at cameras
- No cliché business imagery (handshakes, keyboards, graphs)

**Subjects (by content type):**
- **Regulatory analysis:** Architectural photography — government buildings, courtroom details, document still lifes
- **Insurer results:** Abstract illustrations, metaphor-driven visuals (scales, pillars, paths)
- **Market trends:** Charts transformed into landscape — graphs becoming roads, data becoming terrain
- **Consumer insurance:** Human-scale documentary — warm, dignified, culturally specific to India

**Color treatment:**
- Warm-toned (amber, ochre, cream, olive) — not cool blue
- Muted saturation, editorial grade
- Soft grain or film-like texture acceptable

### Cohesive Moodboard Prompt

> Editorial brand photography for an Indian insurance analysis platform. Warm cream and olive green palette. Subjects include: grand colonial architecture facades in soft overcast light, traditional Indian archways with morning sun, still lifes of leather-bound ledgers with brass magnifying glasses and rosewood pens, golden wheat fields at harvest time, calm hospital corridors with natural light at the far end, vintage accounting desks with warm window light illuminating dust particles. No people smiling at camera. No laptops or smartphones. No graphs or screens. Documentary style, shallow depth of field, warm earth tones. 16:9 aspect ratio. Textured paper-like finish.

---

## 6. Applications

### Digital — Website

The primary brand expression. Built as a static JAMstack site:

- **Navbar:** Sticky-top, transparent on light, `background: var(--nav-bg)` on scroll
- **Hero:** Full-viewport introduction with eyebrow, heading, description, dot pattern texture
- **Cards:** Clean bordered containers (`border: 1px solid var(--border)`, `border-radius: 4px`) with a green left accent bar on category tags
- **Typography:** Article width capped at 680px for optimal reading
- **Dark mode:** `.dark` class toggled via `prefers-color-scheme` with manual override
- **Transitions:** Scoped to interactive elements only (no global `* { transition }`) to prevent flash on load

### Digital — Open Graph Images

Template SVG system at 1200×630:

```
┌────────────────────────────────────────────────────────────┐
│ ██  INSURANCE & MARKET ANALYSIS                           │
│ ██                                                        │
│ ██  BimaNiti                                              │
│ ██                                                        │
│ ██  Analysing markets, decoding insurance,                │
│ ██  and sharing insights that matter.                     │
│ ██                                                        │
│ ██                                             bimaniti.in │
│ ██                                                        │
│ ██  12px green bar on left                                │
└────────────────────────────────────────────────────────────┘
```

- Per-article OG images follow the same template with article-specific title
- Background: `#f5f3ef`
- Green accent bar: 12px, `#4a6741`
- URL always at bottom-right

### Digital — Social Media

- **Twitter/X card:** Uses `logo.svg` directly (`summary_large_image`)
- **Avatar:** Current full logo; future: BN monogram in a 1:1 crop
- **Cover image:** Horizon photo with brand overlay — a misty Indian landscape at dawn with subtle green gradient

### Digital — RSS

- Full-content RSS feed at `feed.xml`
- Branded with logo SVG in the feed header

### Print — Future Applications

If the brand extends to physical materials:

- **Business card:** Warm cream stock (`#f5f3ef`), single-sided, logo top-left, name/role in Outfit 300, contact in Outfit 400, green accent divider
- **Letterhead:** Logo lockup at top, 12px green left border, body in Outfit 300 11pt
- **Report cover:** Full-bleed editorial photograph (architectural subject), logo lower-right, thin green rule, title below in Lora 400
- **Presentation deck:** `#141410` cover slide, logo centered, green accent line below

### Editorial — Charts & Data Visualizations

When presenting data:

- Line color: `#4a6741`
- Grid lines: `#d6d0c8`, 0.5px
- Background: transparent or `#ede9e3`
- Font: Outfit 400 for labels, 600 for data values
- No 3D, no shadows, no unnecessary gridlines
- Annotation style: minimal, text-only, no callout boxes

---

## 7. Tone of Voice

### Principles

| Principle | What It Means in Practice |
|---|---|
| **Authoritative but accessible** | Use industry terminology but always explain it. Assume the reader is smart but not specialised. |
| **Plain-language first** | If a sentence can be understood by an educated non-specialist, keep it. If not, rewrite. No jargon for its own sake. |
| **Transparent about method** | Every assertion should implicitly or explicitly signal: "here is the evidence." Link to primary sources. |
| **Neutral and independent** | State facts without spin. Let the data lead. No superlatives, no hyperbolic claims about the brand itself. |
| **Confident but measured** | Avoid "we believe", "we think" — state findings as findings. Use "suggests", "indicates", "shows" appropriately. |
| **India-rooted** | Context is Indian regulatory and market reality. Comparisons to other markets are valid but secondary. Never default to US-centric framing. |

### Voice Spectrum

| Context | Tone | Example |
|---|---|---|
| Headline | Authoritative, concise | "IRDAI tightens KMP norms" |
| Article opener | Contextual, engaging | "When the regulator speaks, the market listens. Last week, IRDAI..." |
| Analysis body | Measured, precise | "The data suggests a 14% uptick in retail health policies, driven largely by..." |
| About / bio | Warm, confident | "BimaNiti provides independent, plain-language analysis of India's insurance sector." |
| Editorial policy | Formal, transparent | "Every circular, result, and ruling is followed in full. Nothing is asserted without a trail back to the original document." |
| Error / 404 | Calm, helpful | "Page not found. Try the homepage or search." (no jokes, no panic) |
| Meta / footer | Minimal | "Independent Insurance Analysis · India" |

### Words to Use

- analysis, analyse, examine, assess, evaluate
- insight, finding, observation, trend
- regulation, circular, framework, mandate, compliance
- market, sector, segment, structure
- indicator, metric, data point, ratio

### Words to Avoid

- revolutionise, disrupt, game-changer, paradigm shift
- cutting-edge, state-of-the-art, next-gen
- empower, leverage, holistic, synergise
- platform (as a self-descriptor — be specific: "analysis site", "research resource")
- content (as in "content platform" — use "articles", "analysis", "coverage")

---

## 8. Brand Kit Image Prompts

The following prompts can be used in an image-generation tool to produce the 9-panel brand-kit board described in the [brandkit skill](../../../../../../../../Downloads/brandkit-1.0.0/SKILL.md).

### Board 1 — Logo Cover

> Premium brand-kit logo cover panel. Warm cream background (#f5f3ef). Large centered BimaNiti wordmark — "Bima" in clean geometric sans-serif (Outfit, dark text), "Niti" in elegant serif (Lora, forest green #4a6741). Below in small letter-spaced caps: "INSURANCE & MARKET ANALYSIS". The wordmark sits in the upper third of the panel with vast negative space below. A thin green horizontal rule divides the space. Subtle paper texture throughout. No other elements. 4:3 aspect ratio.

### Board 2 — Logo Construction

> Premium brand-kit logo construction panel on warm cream background. Top left: the full BimaNiti wordmark at small scale as reference. Centre: geometric construction diagram showing the alignment grid of the wordmark — vertical baselines, x-heights, cap heights, and letter-spacing guides in thin teal dashed lines. Bottom: three logo variants displayed in a row — full colour, reversed (white on dark square), and monochrome. Thin green annotation labels in small sans-serif caps. Clean grid lines, measured negative space. Presentation-deck aesthetic.

### Board 3 — Digital Application

> Premium brand-kit digital application panel on dark charcoal background (#141410). A minimal browser window frame in the centre with the BimaNiti homepage loaded inside — cream background, green accent left bar on the hero section, elegant Lora serif heading, clean Outfit sans body text. The browser chrome shows only a thin top bar with traffic-light dots, a URL field reading "bimaniti.in", and the BN monogram as favicon. No other tabs or bookmarks. Subtle shadow beneath the browser frame. Restrained, editorial feel.

### Board 4 — Brand Essence

> Premium brand-kit brand essence panel on warm cream background (#f5f3ef). A single line of large editorial typography in Lora serif, weight 400, centred: "Understand Indian insurance — clearly." The text sits in the vertical centre with vast whitespace above and below. A small forest green dot (2px) serves as a full stop after "clearly". Below in tiny Outfit caps, 8pt: "bimaniti.in / brand essence". No other elements. Refined, calm, presentation quality. 4:3.

### Board 5 — Color System

> Premium brand-kit colour system panel on warm cream background. Two rows of colour swatches: Light mode palette on top row, Dark mode palette below. Each swatch is a tall vertical rectangle (60×160px) with the colour displayed and the hex code below in small Outfit sans. Order: bg-primary, bg-secondary, card-bg, text-primary, text-secondary, text-muted, accent, border, alert. A thin green rule separates the two rows. Clean grid alignment. Editorial presentation style.

### Board 6 — Typography

> Premium brand-kit typography panel on warm cream background. Left half: large Lora serif alphabet in weight 400 and 500, with a sample heading: "Aa Bb Cc Dd Ee Ff Gg". Below in italic: "The quick brown fox jumps over the lazy dog." Right half: Outfit sans alphabet in weights 300, 400, and 600 with a sample sentence: "Insurance & Market Analysis — clear, precise, informed." Small labels at the bottom in tiny caps: "Lora · Display" and "Outfit · Body". 4:3.

### Board 7 — Physical Application

> Premium brand-kit physical application panel on warm cream background. A flat-lay composition of brand-print items: a business card in cream stock with the BimaNiti wordmark and green accent divider, a sealed letter in a cream envelope with the BN monogram as a seal stamp, a slim A5 report with a muted green cover and white spine label, and a fountain pen resting beside the documents. Soft natural top-down lighting, editorial flat-lay style. Subtle paper shadows. 4:3.

### Board 8 — Image Direction

> Premium brand-kit image direction panel on dark charcoal background. A full-bleed editorial photograph of a grand colonial-era building facade in Mumbai with neoclassical pillars, shot from a low angle against a soft overcast sky, warm cream and olive green tones, documentary architectural style. A subtle green gradient overlay at the bottom edge (10% opacity) fades up from the bottom. Small label bottom-left in Outfit caps 8pt: "IMAGE DIRECTION — EDITORIAL DOCUMENTARY". Cinematic, calm, refined.

### Board 9 — System Detail

> Premium brand-kit system detail panel on warm cream background. A horizontal strip showing BimaNiti's UI component library in a row: a category pill with label (LIFE in green bg), a tag pill (BREAKING in red), a thin green accent divider line, a small BN monogram icon, a blockquote sample, a drop cap letter "T" in Lora 500 52px, and a URL display reading "bimaniti.in". All elements on a single horizontal axis with clean spacing. Tiny annotation labels below each element in Outfit 7pt. 4:3.

---

## 9. Asset Inventory

| Asset | Location | Status |
|---|---|---|
| Master SVG logo | `/logo.svg` | ✓ Existing |
| Logo PNG (solid) | `/logo.png` (1499×704) | ✓ Existing |
| Logo PNG (transparent) | `/logo-transparent.png` (1499×704) | ✓ Existing |
| Logo preview page | `/logo-preview.html` | ✓ Existing |
| Default OG image | `/assets/og/default.svg` (1200×630) | ✓ Existing |
| Per-article OG images | `/assets/og/*.svg` (35 files) | ✓ Existing |
| Favicon | `/logo.svg` (SVG favicon) | ✓ Existing |
| PWA manifest | (none) | ✗ Missing |
| App icon 192×192 / 512×512 | (none) | ✗ Missing |
| Brand guidelines doc | `This file` | ✓ New |
| BN monogram SVG | (not yet created) | ✗ Proposed |

---

## 10. Brand Principles (Quick Reference)

```
BimaNiti is:
  - Independent & transparent
  - Analytical, not promotional
  - Editorial, not corporate
  - Indian, not generic
  - Clear, not simplistic
  - Calm, not cold
  - Green, not blue

BimaNiti is not:
  - A seller of insurance
  - A comparison site
  - Affiliated with any insurer
  - Financial advice
  - A news aggregator (it's analysis)
```
