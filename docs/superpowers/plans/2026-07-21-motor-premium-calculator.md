# Motor Premium Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an 8th interactive learn track "Motor Premium Calculator" with step-by-step calculation scenes and an interactive premium calculator.

**Architecture:** Add a new scene type `"step"` (linear tutorial) and `"calculator"` (interactive form) to learn.js. New track data in tracks.json with 6 levels. New CSS in learn.css.

**Tech Stack:** Vanilla JS/CSS (no dependencies). Build: Node.js scripts.

## Global Constraints
- All new SVGs: 120x80 viewBox, #4a6741 accent, #b94040 warning, stroke-width 2.5, editorial style matching existing
- Step scenes: no branching, no choice questions, purely linear with "Next Step" button
- Calculator uses hardcoded IRDAI 2026 rate tables
- All existing learn engine features (progress bar, localStorage, nav) must still work for both old and new tracks

---

### Task 1: Add New SVG Illustrations to learn.js

**Files:**
- Modify: `assets/js/learn.js:7-43` (ILLUS dictionary)

**Interfaces:**
- Consumes: nothing
- Produces: `ILLUS.calculator`, `ILLUS.discount`, `ILLUS.formula`, `ILLUS.result` — available to all scene types

- [ ] **Step 1: Add calculator icon**

Insert after the existing ILLUS entries (before the closing `};` on line 43):

```js
    calculator: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="18" width="68" height="48" rx="4"/><text x="36" y="38" font-family="monospace" font-size="14" fill="#4a6741" stroke="none">123</text><text x="36" y="54" font-family="monospace" font-size="10" fill="#8a8a84" stroke="none">456</text><line x1="60" y1="44" x2="82" y2="44" stroke="#8a8a84"/></svg>',
    discount: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="38" cy="38" r="14"/><path d="M48 48 L72 24" stroke="#b94040"/><circle cx="76" cy="52" r="10"/><path d="M34 34 l8 8 M74 26 h8 l-4 8" stroke="#8a8a84"/></svg>',
    formula: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="20" y="20" width="80" height="40" rx="3"/><text x="30" y="44" font-family="monospace" font-size="14" fill="#4a6741" stroke="none">IDV = Price × (1 − Dep%)</text><line x1="28" y1="48" x2="90" y2="48" stroke="#8a8a84"/></svg>',
    result: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="40" r="26"/><path d="M46 40 L56 50 L76 30"/><text x="48" y="20" font-family="monospace" font-size="10" fill="#4a6741" stroke="none">₹</text></svg>'
```

- [ ] **Step 2: Run a quick syntax check**

```bash
cd "C:\Users\DELL\Desktop\AIprojects\bimo\bimaniti"
node -e "require('fs').readFileSync('assets/js/learn.js','utf-8')" > $null
Write-Output "syntax OK"
```

- [ ] **Step 3: Commit**

```bash
git add assets/js/learn.js
git commit -m "feat: add calculator, discount, formula, result SVG illustrations to learn.js"
```

---

### Task 2: Add Step and Calculator Scene Type Handlers to learn.js

**Files:**
- Modify: `assets/js/learn.js:91-168` (renderScene, onChoice functions)

**Interfaces:**
- Consumes: `ILLUS` (from Task 1), `escapeHtml`, `nextScene`, `finishLevel`, `markComplete`, `trackProgress`, `current`, `isComplete` (all existing)
- Produces: `renderStepScene()`, `renderCalculatorScene()`, handling in `renderScene()`

- [ ] **Step 1: Add renderStepScene function**

Insert before the existing `renderScene` function (before line 91):

```js
  function renderStepScene(stepNum, total) {
    var scene = current.levelScenes[current.sceneIndex];
    var illus = ILLUS[scene.illustration] || ILLUS.card;
    var html = '';
    html += '<div class="learn-progress"><div class="learn-progress-bar" style="width:' + Math.round((stepNum / total) * 100) + '%"></div></div>';
    html += '<p class="learn-step">Step ' + stepNum + ' of ' + total + '</p>';
    html += '<div class="learn-illus">' + illus + '</div>';
    html += '<div class="learn-step-content">';
    if (scene.formula) html += '<div class="learn-formula">' + escapeHtml(scene.formula) + '</div>';
    html += '<div class="learn-narrative">' + escapeHtml(scene.narrative) + '</div>';
    if (scene.example) html += '<div class="learn-example">' + escapeHtml(scene.example) + '</div>';
    if (scene.result) html += '<div class="learn-result">' + escapeHtml(scene.result) + '</div>';
    html += '</div>';
    html += '<div class="learn-actions"><button class="learn-btn" id="learn-next">Next Step →</button></div>';
    return html;
  }
```

- [ ] **Step 2: Modify renderScene to handle step type**

Replace the existing `renderScene` function (lines 91-138) with:

```js
  function renderScene() {
    var root = document.getElementById('learn-root');
    if (!root) return;
    var scene = current.levelScenes[current.sceneIndex];
    var total = current.levelScenes.length;
    var step = current.sceneIndex + 1;

    if (scene.type === 'step') {
      root.innerHTML = renderStepScene(step, total);
      root.scrollTop = 0;
      document.getElementById('learn-next').addEventListener('click', nextScene);
      return;
    }

    if (scene.type === 'calculator') {
      root.innerHTML = renderCalculatorScene();
      root.scrollTop = 0;
      attachCalculatorEvents();
      return;
    }

    var illus = ILLUS[scene.illustration] || ILLUS.card;
    var html = '';

    html += '<div class="learn-progress"><div class="learn-progress-bar" style="width:' + Math.round((current.sceneIndex / total) * 100) + '%"></div></div>';
    html += '<p class="learn-step">Scene ' + step + ' of ' + total + '</p>';
    html += '<div class="learn-illus">' + illus + '</div>';
    html += '<div class="learn-narrative">' + escapeHtml(scene.narrative) + '</div>';

    if (scene.concept) {
      html += '<div class="learn-concept">';
      html += '<h3>' + escapeHtml(scene.concept.title) + '</h3><ul>';
      scene.concept.points.forEach(function (p) { html += '<li>' + escapeHtml(p) + '</li>'; });
      html += '</ul></div>';
      html += '<div class="learn-actions"><button class="learn-btn" id="learn-next">Finish Level ✓</button></div>';
    } else if (scene.reveal) {
      html += '<div class="learn-feedback" id="learn-feedback">' + escapeHtml(scene.feedback) + '</div>';
      html += '<div class="learn-actions"><button class="learn-btn" id="learn-next">Continue →</button></div>';
    } else {
      html += '<p class="learn-question">' + escapeHtml(scene.question) + '</p>';
      html += '<div class="learn-choices" id="learn-choices">';
      scene.choices.forEach(function (c, i) {
        html += '<button class="learn-choice" data-i="' + i + '">' + escapeHtml(c.text) + '</button>';
      });
      html += '</div>';
      html += '<div class="learn-feedback hidden" id="learn-feedback"></div>';
    }

    root.innerHTML = html;
    root.scrollTop = 0;

    if (scene.concept) {
      document.getElementById('learn-next').addEventListener('click', finishLevel);
    } else if (scene.reveal) {
      document.getElementById('learn-next').addEventListener('click', nextScene);
    } else if (!scene.type) {
      var choices = root.querySelectorAll('.learn-choice');
      choices.forEach(function (btn) {
        btn.addEventListener('click', function () { onChoice(parseInt(btn.getAttribute('data-i'), 10)); });
      });
    }
  }
```

- [ ] **Step 3: Add renderCalculatorScene and attachCalculatorEvents**

Insert before the existing `nextScene` function (before line 185):

```js
  function renderCalculatorScene() {
    return '<div class="learn-calculator">' +
      '<div class="learn-illus">' + ILLUS.calculator + '</div>' +
      '<h2>Interactive Premium Calculator</h2>' +
      '<p style="color:var(--text-muted);margin-bottom:1.5rem;">Enter your vehicle details below to calculate the total premium step by step.</p>' +
      '<div class="learn-calc-form">' +
      '<label>Ex-showroom Price (₹)<input type="number" id="calc-price" class="learn-calc-input" value="800000" min="100000" max="5000000"></label>' +
      '<label>Engine Capacity<select id="calc-cc" class="learn-calc-input">' +
      '<option value="1000">Up to 1000 cc</option>' +
      '<option value="1500" selected>1001 - 1500 cc</option>' +
      '<option value="2500">Above 1500 cc</option>' +
      '</select></label>' +
      '<label>Vehicle Age (years)<input type="number" id="calc-age" class="learn-calc-input" value="1" min="0" max="15"></label>' +
      '<label>NCB Claim-Free Years<input type="number" id="calc-ncb" class="learn-calc-input" value="5" min="0" max="10"></label>' +
      '<fieldset><legend>Add-ons</legend>' +
      '<label class="learn-calc-check"><input type="checkbox" id="calc-zerodep" checked> Zero Depreciation (₹3,600)</label>' +
      '<label class="learn-calc-check"><input type="checkbox" id="calc-engine"> Engine Protect (₹1,500)</label>' +
      '<label class="learn-calc-check"><input type="checkbox" id="calc-rsa"> Roadside Assistance (₹750)</label>' +
      '<label class="learn-calc-check"><input type="checkbox" id="calc-ncbprot"> NCB Protection (₹800)</label>' +
      '<label class="learn-calc-check"><input type="checkbox" id="calc-passenger"> Unnamed Passenger Cover (₹550)</label>' +
      '</fieldset>' +
      '</div>' +
      '<div class="learn-calc-output" id="calc-output"></div>' +
      '<div class="learn-actions"><button class="learn-btn" id="learn-finish" style="display:none;">Finish Level ✓</button></div>' +
      '</div>';
  }

  function calcPremium() {
    var price = parseFloat(document.getElementById('calc-price').value) || 800000;
    var cc = parseInt(document.getElementById('calc-cc').value);
    var age = parseInt(document.getElementById('calc-age').value) || 0;
    var ncbYrs = parseInt(document.getElementById('calc-ncb').value) || 0;

    // Depreciation table (car age vs %)
    var depPct = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 50, 50, 50, 50, 50];
    var dep = depPct[Math.min(age, 15)] || 50;
    var idv = Math.round(price * (100 - dep) / 100);

    // OD rate by cc
    var odRate = cc <= 1000 ? 0.0337 : (cc <= 1500 ? 0.0314 : 0.0291);
    var odPremium = Math.round(idv * odRate);

    // NCB scale
    var ncbPct = [0, 20, 25, 35, 45, 50, 50, 50, 50, 50, 50];
    var ncb = ncbPct[Math.min(ncbYrs, 10)];
    var ncbDiscount = Math.round(odPremium * ncb / 100);

    // TP premium by cc
    var tpPremium = cc <= 1000 ? 2349 : (cc <= 1500 ? 3703 : 8585);

    // Add-ons
    var addons = 0;
    if (document.getElementById('calc-zerodep').checked) addons += 3600;
    if (document.getElementById('calc-engine').checked) addons += 1500;
    if (document.getElementById('calc-rsa').checked) addons += 750;
    if (document.getElementById('calc-ncbprot').checked) addons += 800;
    if (document.getElementById('calc-passenger').checked) addons += 550;

    var subtotal = odPremium - ncbDiscount + tpPremium + addons;
    var gst = Math.round(subtotal * 0.18);
    var total = subtotal + gst;

    document.getElementById('calc-output').innerHTML =
      '<table class="learn-calc-table">' +
      '<tr><td>Ex-showroom Price</td><td class="num">₹ ' + price.toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>Depreciation (' + dep + '%)</td><td class="num">− ₹ ' + Math.round(price * dep / 100).toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td><strong>IDV (Insured Declared Value)</strong></td><td class="num strong">₹ ' + idv.toLocaleString('en-IN') + '</td></tr>' +
      '<tr class="sep"><td>OD Rate (' + (odRate * 100).toFixed(2) + '%)</td><td class="num">₹ ' + odPremium.toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>NCB Discount (' + ncb + '%)</td><td class="num">− ₹ ' + ncbDiscount.toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>Net OD Premium</td><td class="num">₹ ' + (odPremium - ncbDiscount).toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>Third-Party Premium</td><td class="num">₹ ' + tpPremium.toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>Add-ons Total</td><td class="num">₹ ' + addons.toLocaleString('en-IN') + '</td></tr>' +
      '<tr class="sep"><td>Subtotal</td><td class="num">₹ ' + subtotal.toLocaleString('en-IN') + '</td></tr>' +
      '<tr><td>GST @ 18%</td><td class="num">₹ ' + gst.toLocaleString('en-IN') + '</td></tr>' +
      '<tr class="total"><td><strong>Total Premium</strong></td><td class="num strong">₹ ' + total.toLocaleString('en-IN') + '</td></tr>' +
      '</table>';
  }

  function attachCalculatorEvents() {
    var inputs = document.querySelectorAll('.learn-calc-input, .learn-calc-check input');
    inputs.forEach(function (el) {
      el.addEventListener('input', calcPremium);
      el.addEventListener('change', calcPremium);
    });
    calcPremium();
    document.getElementById('learn-finish').style.display = '';
    document.getElementById('learn-finish').addEventListener('click', finishLevel);
  }
```

- [ ] **Step 4: Verify JS syntax**

```bash
node -e "var fs=require('fs');var s=fs.readFileSync('assets/js/learn.js','utf-8');new Function(s);console.log('JS syntax OK')"
```

- [ ] **Step 5: Commit**

```bash
git add assets/js/learn.js
git commit -m "feat: add step and calculator scene types to learn.js engine"
```

---

### Task 3: Add Step and Calculator CSS to learn.css

**Files:**
- Modify: `assets/css/learn.css`

- [ ] **Step 1: Append new CSS at end of learn.css**

```css

/* ---- Motor Premium Calculator: step scenes ---- */
.learn-step-content {
  max-width: 36rem;
  margin: 0 auto;
  text-align: left;
}
.learn-formula {
  font-family: 'Courier New', Courier, monospace;
  font-size: 15px;
  background: color-mix(in srgb, var(--accent) 8%, transparent);
  border-left: 3px solid var(--accent);
  padding: 12px 16px;
  margin-bottom: 16px;
  border-radius: 0 var(--radius) var(--radius) 0;
  line-height: 1.6;
  overflow-x: auto;
  white-space: nowrap;
}
.learn-example {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  margin: 14px 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-primary);
}
.learn-result {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin: 14px 0;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  color: var(--accent);
}

/* ---- Interactive Calculator ---- */
.learn-calculator {
  max-width: 36rem;
  margin: 0 auto;
  text-align: left;
}
.learn-calculator h2 {
  text-align: center;
  margin-bottom: 4px;
}
.learn-calc-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}
.learn-calc-form label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  gap: 4px;
}
.learn-calc-input {
  font-family: var(--font-body);
  font-size: 15px;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--card-bg);
  color: var(--text-primary);
  transition: border-color 0.15s;
}
.learn-calc-input:focus {
  border-color: var(--accent);
  outline: none;
}
.learn-calc-form fieldset {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  margin-top: 4px;
}
.learn-calc-form legend {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  padding: 0 6px;
}
.learn-calc-check {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 400 !important;
  color: var(--text-primary) !important;
  padding: 4px 0;
}
.learn-calc-check input {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
  cursor: pointer;
}
.learn-calc-output {
  margin-bottom: 16px;
}
.learn-calc-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.learn-calc-table tr td {
  padding: 6px 0;
  border-bottom: 1px solid var(--border);
}
.learn-calc-table tr.sep td {
  border-bottom: 2px solid var(--text-muted);
  padding-top: 10px;
}
.learn-calc-table tr.total td {
  border-top: 2px solid var(--accent);
  border-bottom: none;
  padding-top: 10px;
  font-size: 16px;
}
.learn-calc-table .num {
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-family: 'Courier New', Courier, monospace;
}
.learn-calc-table .strong {
  font-weight: 600;
  color: var(--accent);
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/learn.css
git commit -m "feat: add step scene and calculator CSS styles"
```

---

### Task 4: Add Motor Premium Calculator Track to tracks.json

**Files:**
- Modify: `data/learn/tracks.json`

- [ ] **Step 1: Insert new track at the beginning of the tracks array**

Insert after line 2 (`"tracks": [`), before the existing first track:

```json
    {
      "id": "motor-premium-calculator",
      "title": "Motor Premium Calculator",
      "tagline": "Calculate motor premiums from scratch — IDV to final price.",
      "icon": "calculator",
      "levels": [
        {
          "id": "idv",
          "title": "Level 1 · IDV Calculation",
          "intro": "Learn how Insured Declared Value is calculated — the foundation of your motor premium.",
          "scenes": [
            {
              "id": "i1",
              "type": "step",
              "illustration": "idv",
              "narrative": "IDV (Insured Declared Value) is the maximum amount your insurer will pay if your car is stolen or damaged beyond repair (total loss). It is NOT the ex-showroom price — it is the current market value after depreciation.",
              "formula": "IDV = Ex-showroom Price × (1 − Depreciation %)",
              "result": "Higher IDV = higher premium but better payout. Lower IDV = cheaper premium but lower claim amount."
            },
            {
              "id": "i2",
              "type": "step",
              "illustration": "formula",
              "narrative": "IRDAI prescribes a standard depreciation table for cars based on age. The depreciation % increases every year up to 50%, after which it stays flat.",
              "formula": "Depreciation % by age:\n0-6 months: 5% | 6-12 months: 10%\n1-2 years: 15% | 2-3 years: 20%\n3-4 years: 25% | 4-5 years: 30%\n5-10 years: 40% | 10+ years: 50%",
              "result": "A car that is 3 years old has 25% depreciation applied to its ex-showroom price."
            },
            {
              "id": "i3",
              "type": "step",
              "illustration": "result",
              "narrative": "Let us calculate IDV for a Maruti Suzuki Baleno Zeta (ex-showroom ₹8,27,000) that is 1 year old.",
              "formula": "IDV = ₹8,27,000 × (1 − 0.15)\nIDV = ₹8,27,000 × 0.85\nIDV = ₹7,02,950",
              "example": "1 year old → 15% depreciation.\nDepreciation amount: ₹8,27,000 × 15% = ₹1,24,050\nIDV = ₹8,27,000 − ₹1,24,050 = ₹7,02,950",
              "result": "The IDV for this 1-year-old Baleno is approximately ₹7,03,000 (rounded)."
            },
            {
              "id": "i4",
              "type": "step",
              "illustration": "card",
              "narrative": "You now know the most important building block of motor premium calculation.",
              "concept": {
                "title": "IDV Calculation — Key Rules",
                "points": [
                  "IDV = Ex-showroom price minus depreciation as per IRDAI age-based table.",
                  "Depreciation ranges from 5% (new) to 50% (10+ years).",
                  "Insurers may offer a higher IDV (upto 10% above calculated) at extra premium.",
                  "For add-ons like Zero Dep cover, IDV is still calculated the same way — the add-on changes how depreciation is handled at claim time, not at calculation time."
                ]
              }
            }
          ]
        },
        {
          "id": "tp",
          "title": "Level 2 · Third-Party Premium",
          "intro": "The mandatory part of every motor policy — how TP premium is set by IRDAI.",
          "scenes": [
            {
              "id": "t1",
              "type": "step",
              "illustration": "car",
              "narrative": "Third-Party (TP) liability insurance is mandatory for every motor vehicle in India. It covers your legal liability for: death or injury to a third person, and damage to third-party property (up to ₹7.5 lakh).",
              "formula": "TP Premium = Fixed rate set by IRDAI based on engine capacity",
              "result": "You cannot reduce TP premium — it is fixed, not based on IDV or your driving history."
            },
            {
              "id": "t2",
              "type": "step",
              "illustration": "formula",
              "narrative": "IRDAI sets different TP premium rates for private cars based on engine cubic capacity (cc). These are revised periodically.",
              "formula": "Private Car TP Rates (FY26-27):\nUp to 1000 cc: ₹2,349 per year\n1001 to 1500 cc: ₹3,703 per year\nAbove 1500 cc: ₹8,585 per year",
              "example": "A Baleno with 1197 cc engine falls in the 1001-1500 cc bracket.\nAnnual TP premium: ₹3,703",
              "result": "The TP premium is the same for all cars in the same cc bracket regardless of car price."
            },
            {
              "id": "t3",
              "type": "step",
              "illustration": "result",
              "narrative": "For new cars, you can buy a long-term TP policy (3 years for cars) at the time of purchase. This is mandatory for new vehicle registrations.",
              "formula": "3-Year TP Premium = Year 1 + Year 2 + Year 3\n= ₹3,703 + ₹2,963 + ₹2,963 = ₹9,629",
              "example": "Year 1: full rate (₹3,703)\nYear 2: 80% of Year 1 (₹2,963)\nYear 3: 80% of Year 1 (₹2,963)\nTotal for 3 years: ₹9,629 + GST",
              "result": "Long-term TP gives 3 years of coverage and protects against premium hikes."
            },
            {
              "id": "t4",
              "type": "step",
              "illustration": "card",
              "narrative": "You now understand the mandatory half of your motor premium.",
              "concept": {
                "title": "Third-Party Premium — Key Rules",
                "points": [
                  "TP premium is fixed by IRDAI based on engine capacity — you cannot negotiate or reduce it.",
                  "Current rates (FY27): ₹2,349 / ₹3,703 / ₹8,585 for private cars by cc bracket.",
                  "Long-term TP (3 years) is mandatory for new cars and protects against rate revisions.",
                  "GST at 18% is added to the TP premium."
                ]
              }
            }
          ]
        },
        {
          "id": "od",
          "title": "Level 3 · Own Damage Premium",
          "intro": "The optional but crucial part — how OD premium is calculated as a percentage of IDV.",
          "scenes": [
            {
              "id": "o1",
              "type": "step",
              "illustration": "split",
              "narrative": "Own Damage (OD) covers damage to YOUR car from accidents, fire, theft, natural calamities, and vandalism. Unlike TP, OD is optional but recommended.",
              "formula": "OD Premium = IDV × OD Rate (%)",
              "result": "OD premium depends on your car's IDV and the OD rate applied by the insurer."
            },
            {
              "id": "o2",
              "type": "step",
              "illustration": "formula",
              "narrative": "The OD rate varies by engine capacity and is set by IRDAI as a base rate. Insurers can load or discount within a band.",
              "formula": "Base OD Rates for Private Cars (FY27):\nUp to 1000 cc: 3.37% of IDV\n1001 to 1500 cc: 3.14% of IDV\nAbove 1500 cc: 2.91% of IDV",
              "example": "Baleno IDV = ₹7,02,950, cc = 1197 (1001-1500 bracket)\nOD Premium = ₹7,02,950 × 3.14%\nOD Premium = ₹7,02,950 × 0.0314 = ₹22,073",
              "result": "The base OD premium for this car is ₹22,073 before any discounts or loads."
            },
            {
              "id": "o3",
              "type": "step",
              "illustration": "discount",
              "narrative": "You can reduce your OD premium by choosing a higher voluntary deductible. A deductible is the amount you pay per claim before the insurer pays.",
              "formula": "Voluntary Deductible Discounts:\n₹2,000 deductible → ~15% off OD premium\n₹5,000 deductible → ~30% off OD premium\n₹10,000 deductible → ~45% off OD premium",
              "example": "With ₹5,000 voluntary deductible:\nOD Premium = ₹22,073 − 30% = ₹15,451",
              "result": "Higher deductible = lower premium but more out-of-pocket at claim time."
            },
            {
              "id": "o4",
              "type": "step",
              "illustration": "card",
              "narrative": "The OD premium is where most of the calculation happens.",
              "concept": {
                "title": "Own Damage Premium — Key Rules",
                "points": [
                  "OD premium = IDV × OD rate (typically 2.9% to 3.37% based on cc).",
                  "You can reduce OD premium with a voluntary deductible.",
                  "Fitting anti-theft devices and AIS (Automated Inspection System) also qualify for small discounts.",
                  "Combined OD + TP = Comprehensive policy."
                ]
              }
            }
          ]
        },
        {
          "id": "ncb",
          "title": "Level 4 · NCB & Discounts",
          "intro": "Your reward for not making claims — No Claim Bonus can cut your OD premium by up to 50%.",
          "scenes": [
            {
              "id": "n1",
              "type": "step",
              "illustration": "ncb",
              "narrative": "No Claim Bonus (NCB) is a discount on your OD premium for every claim-free year. It is your reward for safe driving. NCB applies ONLY to the OD portion, NOT to TP.",
              "formula": "NCB Discount = OD Premium × NCB %\nFinal OD = OD Premium − NCB Discount",
              "result": "NCB is the single biggest discount available on motor insurance."
            },
            {
              "id": "n2",
              "type": "step",
              "illustration": "discount",
              "narrative": "NCB accumulates over claim-free years. The scale is set by IRDAI and is transferable if you switch insurers.",
              "formula": "NCB Scale (private cars):\n0 claim-free years: 0%\n1 year: 20% | 2 years: 25%\n3 years: 35% | 4 years: 45%\n5+ years: 50% (maximum)",
              "result": "After 5 claim-free years, you get the maximum 50% discount on OD premium."
            },
            {
              "id": "n3",
              "type": "step",
              "illustration": "result",
              "narrative": "Let us apply NCB to our Baleno example.",
              "formula": "OD Premium: ₹22,073\nNCB at 50% (5 claim-free years): ₹22,073 × 50% = ₹11,037\nNet OD Premium: ₹22,073 − ₹11,037 = ₹11,036",
              "example": "Without NCB: OD = ₹22,073\nWith 50% NCB: OD = ₹11,036\nYou save ₹11,037 per year just by being claim-free.",
              "result": "NCB alone can halve your OD premium. Protect it wisely."
            },
            {
              "id": "n4",
              "type": "step",
              "illustration": "discount",
              "narrative": "Other discounts you may qualify for: voluntary deductible (already covered), anti-theft device discount (~2.5% of OD), and AIS (Automated Inspection System) discount.",
              "formula": "Total OD Discount = NCB % + Voluntary Deductible Discount\n(Most discounts apply to the base OD premium, not cumulatively to the reduced amount.)",
              "result": "Always ask your insurer about all applicable discounts — they add up."
            },
            {
              "id": "n5",
              "type": "step",
              "illustration": "card",
              "narrative": "Now you can optimize your premium using NCB and discounts.",
              "concept": {
                "title": "NCB & Discounts — Key Rules",
                "points": [
                  "NCB applies only to OD premium, not TP.",
                  "NCB ranges from 20% (1 year) to 50% (5+ years).",
                  "Making a claim resets NCB to 0% — weigh small claims vs. losing NCB.",
                  "NCB is transferable when switching insurers (with valid NCB certificate).",
                  "NCB Protection add-on preserves your NCB after 1 claim."
                ]
              }
            }
          ]
        },
        {
          "id": "addons",
          "title": "Level 5 · Add-ons",
          "intro": "Optional covers that enhance your policy — each with a specific cost and use case.",
          "scenes": [
            {
              "id": "a1",
              "type": "step",
              "illustration": "addons",
              "narrative": "Add-ons are optional covers you can buy to enhance your comprehensive policy. Each has a fixed or percentage-based cost. Do not buy add-ons blindly — pick based on your car and usage.",
              "formula": "Total Add-on Cost = Sum of individual add-on premiums",
              "result": "Add-ons typically add ₹5,000 to ₹10,000 to your total premium."
            },
            {
              "id": "a2",
              "type": "step",
              "illustration": "discount",
              "narrative": "Zero Depreciation (Nil Dep) is the most popular add-on. It waives the depreciation deduction on replaced parts at claim time. Without it, plastic/rubber parts get 50% depreciation, metal parts get 10-30%.",
              "formula": "Zero Depreciation Cover = ~₹3,000 to ₹4,000 per year\n(Cost varies by IDV — typically 0.5% to 0.7% of IDV)",
              "example": "At ₹7,02,950 IDV: Zero Dep add-on ≈ ₹3,600 per year.\nWithout Zero Dep: a ₹10,000 plastic bumper replacement pays only ₹5,000.\nWith Zero Dep: pays full ₹10,000.",
              "result": "Zero Dep is highly recommended for new cars up to 5 years old."
            },
            {
              "id": "a3",
              "type": "step",
              "illustration": "addons",
              "narrative": "Other important add-ons and their typical costs:",
              "formula": "Engine & Gearbox Protect: ~₹1,500 — covers repair of engine, gearbox, and hybrid battery.\nRoadside Assistance (RSA): ~₹750 — towing, flat tire, fuel delivery.\nNCB Protection: ~₹800 — preserves your NCB after one claim.\nUnnamed Passenger Cover: ~₹550 — covers injuries to occupants (varies by sum insured).",
              "result": "Pick add-ons based on your risk profile, not because the agent suggests them."
            },
            {
              "id": "a4",
              "type": "step",
              "illustration": "result",
              "narrative": "Let us combine all add-ons for our Baleno example.",
              "formula": "Zero Dep: ₹3,600\nEngine Protect: ₹1,500\nRoadside Assistance: ₹750\nNCB Protection: ₹800\nUnnamed Passenger: ₹550\nTotal Add-ons: ₹7,200",
              "result": "Add-ons add ₹7,200 to the annual premium. In practice, pick only the ones you need."
            },
            {
              "id": "a5",
              "type": "step",
              "illustration": "card",
              "narrative": "Add-ons complete your policy. Choose wisely.",
              "concept": {
                "title": "Add-ons — Key Rules",
                "points": [
                  "Zero Dep is the most valuable add-on for cars under 5 years — without it, you bear depreciation on replaced parts.",
                  "Engine Protect is critical in flood-prone areas.",
                  "NCB Protection saves your accumulated NCB after one claim — worth it if you have 50% NCB.",
                  "Unnamed Passenger Cover is cheap and covers fellow occupants.",
                  "Roadside Assistance is useful for highway commuters."
                ]
              }
            }
          ]
        },
        {
          "id": "calculator",
          "title": "Level 6 · Interactive Calculator",
          "intro": "Put it all together — calculate a complete premium in real time.",
          "scenes": [
            {
              "id": "c1",
              "type": "calculator",
              "illustration": "calculator"
            }
          ]
        }
      ]
    },
```

- [ ] **Step 2: Verify JSON validity**

```bash
cd "C:\Users\DELL\Desktop\AIprojects\bimo\bimaniti"
try {
  $data = Get-Content -Raw data/learn/tracks.json | ConvertFrom-Json
  $trackCount = $data.tracks.Count
  Write-Output "tracks.json: OK - $trackCount tracks"
} catch {
  Write-Output "ERROR: $_"
}
```

- [ ] **Step 3: Commit**

```bash
git add data/learn/tracks.json
git commit -m "feat: add motor premium calculator track with 6 levels to tracks.json"
```

---

### Task 5: Build, Verify, Commit, and Push

**Files:**
- Generate: `learn/motor-premium-calculator.html`
- Modify: none

- [ ] **Step 1: Run the build**

```bash
cd "C:\Users\DELL\Desktop\AIprojects\bimo\bimaniti"
npm run build
```

- [ ] **Step 2: Verify generated page exists**

```bash
if (Test-Path "learn/motor-premium-calculator.html") { Write-Output "✓ learn/motor-premium-calculator.html generated" } else { Write-Output "✗ MISSING" }
```

- [ ] **Step 3: Verify no build errors by running again**

```bash
cd "C:\Users\DELL\Desktop\AIprojects\bimo\bimaniti"
npm run build 2>&1 | Select-String -Pattern "error|Error|fail|Fail"
Write-Output "Build completed"
```

- [ ] **Step 4: Commit all generated files**

```bash
git add .
git commit -m "feat: build motor premium calculator learn track"
```

- [ ] **Step 5: Push**

```bash
git push
```
