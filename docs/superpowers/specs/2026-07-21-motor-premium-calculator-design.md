# Motor Premium Calculator — Interactive Learn Track

## Overview
A new interactive learn track that teaches users how to manually calculate motor/private car insurance premiums from scratch — IDV to final premium. 8th track on the learn hub, visually and functionally distinct from the 7 existing Q&A tracks.

## Track Metadata
- **ID:** `motor-premium-calculator`
- **Title:** Motor Premium Calculator
- **Tagline:** *"Calculate motor premiums from scratch — IDV to final price."*
- **Icon:** `calculator` (new SVG illustration)
- **Visual treatment:** Card uses a monospace/numerical accent to differentiate from storybook tracks

## Architecture — Changes Required

### 1. `data/learn/tracks.json` — New Track Definition
6 levels, each with 3–5 step scenes. New scene type: `"step"`.

**Level 1: IDV Calculation** (4 steps)
- Concept of IDV, depreciation table for cars (age-based %), formula IDV = Ex-showroom × (1 - Dep %), worked example

**Level 2: Third-Party Premium** (4 steps)
- TP mandate, engine cc bands and base TP rates, long-term TP, worked example with GST

**Level 3: Own Damage Premium** (4 steps)
- OD rate as % of IDV, formula, factor adjustments (voluntary deductible, anti-theft), worked example

**Level 4: NCB & Discounts** (5 steps)
- NCB concept, NCB scale table (20% to 50%), applying NCB to OD, other discounts, worked example

**Level 5: Add-ons** (6 steps)
- Zero Dep, Engine & Gearbox Protect, RSA, NCB Protection, Unnamed Passenger Cover, summed example

**Level 6: Full Calculation — Interactive Calculator** (1 scene, type `"calculator"`)
- HTML form: ex-showroom price, engine cc, registration year, NCB years, add-on toggles
- Real-time output: premium breakdown table

### 2. `assets/js/learn.js` — New Scene Type Handler
Add handling for `"step"` scenes (linear content + Next Step button) and `"calculator"` scene (interactive form with real-time calculation). Approximately 30-40 lines added.

### 3. `assets/css/learn.css` — New Styles
Classes: `.learn-step-content`, `.learn-formula`, `.learn-example`, `.learn-result`, `.learn-calculator`, `.learn-calc-input`, `.learn-calc-output`, `.learn-calc-total`

### 4. SVG Illustrations — New Icons
Add to `ILLUS` dictionary: `calculator`, `discount`, `formula`, `result`

## Data Flow
1. Build generates `learn/motor-premium-calculator.html` from track data
2. Learn hub displays 8 track cards (existing 7 + new)
3. User clicks new track → level grid
4. Each level renders step scenes linearly — no branching, no choice questions
5. Level 6 renders the interactive calculator form with client-side JS calculation

## Constraints
- Step scenes have no choices — purely linear tutorial
- No wrong answers — cannot "fail" a step
- Calculator uses hardcoded IRDAI rate tables (2026) — updateable
- Mobile-responsive, print-friendly

## Files Modified
1. `data/learn/tracks.json` — add new track
2. `assets/js/learn.js` — add step and calculator scene handlers, new SVG icons
3. `assets/css/learn.css` — add step + calculator styles
4. `scripts/build.mjs` — no changes (build is data-driven)
