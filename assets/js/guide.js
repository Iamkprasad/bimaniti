/* BimaNiti Guide — renders data/insurance-knowledge.json as a side-rail docs layout.
   CSP-safe: no inline handlers, no eval. Plain DOM building. */
(function () {
  'use strict';

  var root = document.getElementById('guide-root');
  if (!root) return;

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function fmtYear(y) { return (y && y > 0) ? String(y) : '—'; }

  // Footnote registry per section. Each section collects cited sources and
  // numbers them; superscript links point to that section's footnote list.
  function makeFootnotes() {
    var used = [];        // ordered list of source labels used in this section
    var map = {};         // label -> number
    return {
      cite: function (label) {
        if (!label) return '';
        if (!map[label]) { used.push(label); map[label] = used.length; }
        var n = map[label];
        return '<sup class="guide-ref"><a href="#fn-' + esc(label) + '">' + n + '</a></sup>';
      },
      render: function (sourceMap) {
        if (!used.length) return null;
        var wrap = el('div', 'guide-footnotes');
        wrap.appendChild(el('h4', null, 'Sources'));
        var ol = el('ol');
        used.forEach(function (label) {
          var full = (sourceMap && sourceMap[label]) ? sourceMap[label] : label;
          var li = el('li', null, esc(full));
          li.id = 'fn-' + label;
          ol.appendChild(li);
        });
        wrap.appendChild(ol);
        return wrap;
      }
    };
  }

  function callout(kind, tag, text, fn) {
    var c = el('div', 'guide-callout' + (kind === 'myth' ? ' myth' : ''));
    var head = el('span', 'tag', tag);
    c.appendChild(head);
    c.appendChild(el('p', null, esc(text) + (fn ? ' ' + fn : '')));
    return c;
  }

  function render(data) {
    root.innerHTML = '';
    var meta = data.meta || {};
    var sourceMap = meta.sourceMap || {};

    // ---- Layout container: rail + content ----
    var layout = el('div', 'guide-layout');
    var rail = el('nav', 'guide-rail'); rail.setAttribute('aria-label', 'Sections');
    var content = el('div', 'guide-content');

    var sectionDefs = [
      { id: 'what', label: 'What is insurance' },
      { id: 'principles', label: 'Principles' },
      { id: 'history-global', label: 'World history' },
      { id: 'history-india', label: 'India history' },
      { id: 'regulator', label: 'Regulator' },
      { id: 'market', label: 'Market' },
      { id: 'distribution', label: 'Who can sell' },
      { id: 'insurers', label: 'Insurers' },
      { id: 'glossary', label: 'Glossary' }
    ];

    // Hero meta chip (date only — no version)
    var updated = el('div', 'guide-updated', 'Last updated: ' + esc(meta.lastUpdated || '—'));
    var hero = document.querySelector('.guide-hero-sub');
    if (hero) { hero.appendChild(document.createElement('br')); hero.appendChild(updated); }

    // Build rail links
    sectionDefs.forEach(function (s) {
      var a = el('a', 'guide-rail-link', esc(s.label));
      a.href = '#' + s.id;
      a.setAttribute('data-target', s.id);
      rail.appendChild(a);
    });

    var builtSections = [];

    function section(id, title, builder) {
      var sec = el('section', 'guide-section'); sec.id = id;
      sec.appendChild(el('h2', null, esc(title)));
      var fn = makeFootnotes();
      builder(sec, fn);
      var fns = fn.render(sourceMap);
      if (fns) sec.appendChild(fns);
      content.appendChild(sec);
      builtSections.push(sec);
    }

    // 1. What is insurance
    section('what', 'What is Insurance?', function (sec, fn) {
      var d = data.whatIsInsurance || {};
      if (d.definition) sec.appendChild(el('p', null, esc(d.definition) + fn.cite(d.source)));
      if (d.buildingBlocks && d.buildingBlocks.length) {
        sec.appendChild(el('h3', null, 'The six building blocks'));
        var dl = el('dl', 'guide-deflist');
        d.buildingBlocks.forEach(function (b) {
          dl.appendChild(el('dt', null, esc(b.term) + fn.cite(b.source)));
          dl.appendChild(el('dd', null, esc(b.meaning)));
        });
        sec.appendChild(dl);
      }
      if (d.whyUsed && d.whyUsed.length) {
        sec.appendChild(el('h3', null, 'Why people use insurance'));
        var ul = el('ul');
        d.whyUsed.forEach(function (w) {
          ul.appendChild(el('li', null, '<strong>' + esc(w.reason) + '.</strong> ' + esc(w.example) + fn.cite(w.source)));
        });
        sec.appendChild(ul);
      }
      if (d.commonMyth) sec.appendChild(callout('myth', 'Myth', d.commonMyth));
    });

    // 2. Principles
    section('principles', 'The Seven Principles of Insurance', function (sec, fn) {
      var list = data.principles || [];
      sec.appendChild(el('p', null, 'Every insurance contract in India rests on these seven ideas. They come from a long common-law tradition shared with the UK.'));
      list.forEach(function (p, i) {
        var h = el('h3', null, (i + 1) + '. ' + esc(p.name) + fn.cite(p.source));
        sec.appendChild(h);
        if (p.plainDefinition) sec.appendChild(el('p', null, esc(p.plainDefinition)));
        if (p.example) sec.appendChild(callout('info', 'Example', p.example, fn.cite(p.exampleSource || p.source)));
        if (p.indiaNuance) sec.appendChild(callout('info', 'In India', p.indiaNuance, fn.cite(p.indiaNuanceSource || p.source)));
        if (p.commonMyth) sec.appendChild(callout('myth', 'Myth', p.commonMyth));
      });
    });

    // 3. Global history
    section('history-global', 'A Short History of Insurance (World)', function (sec, fn) {
      var list = data.historyGlobal || [];
      var tl = el('div', 'guide-timeline');
      list.forEach(function (it) {
        var item = el('div', 'guide-tl-item');
        item.appendChild(el('div', 'guide-tl-year', esc(it.year)));
        item.appendChild(el('div', 'guide-tl-event', esc(it.event) + fn.cite(it.source)));
        item.appendChild(el('div', 'guide-tl-detail', esc(it.detail)));
        tl.appendChild(item);
      });
      sec.appendChild(tl);
    });

    // 4. India history
    section('history-india', 'Insurance in India — A Timeline', function (sec, fn) {
      var list = data.historyIndia || [];
      var tl = el('div', 'guide-timeline');
      list.forEach(function (it) {
        var item = el('div', 'guide-tl-item');
        item.appendChild(el('div', 'guide-tl-year', esc(it.year)));
        item.appendChild(el('div', 'guide-tl-event', esc(it.event) + fn.cite(it.source)));
        item.appendChild(el('div', 'guide-tl-detail', esc(it.detail)));
        tl.appendChild(item);
      });
      sec.appendChild(tl);
    });

    // 5. Regulator
    section('regulator', 'The Regulator: IRDAI', function (sec, fn) {
      var d = data.regulator || {};
      sec.appendChild(el('p', null, '<strong>' + esc(d.name || '') + '.</strong> ' + esc(d.role || '') + fn.cite(d.source)));
      if (d.formed) sec.appendChild(el('p', null, esc(d.formed)));
      if (d.whoReportsTo) sec.appendChild(el('p', null, '<strong>Reports to:</strong> ' + esc(d.whoReportsTo)));
      if (d.commonMyth) sec.appendChild(callout('myth', 'Myth', d.commonMyth));
    });

    // 6. Market
    section('market', 'The Indian Insurance Market', function (sec, fn) {
      var d = data.market || {};
      sec.appendChild(el('p', null, 'Snapshot: ' + esc(d.snapshotYear || '') + '.'));
      [['Premium', d.premium, d.premiumSource], ['Penetration', d.penetration, d.penetrationSource],
       ['Density', d.density, d.densitySource], ['Trend', d.trend, d.trendSource],
       ['Protection gap', d.protectionGap, d.protectionGapSource]].forEach(function (row) {
        if (row[1]) sec.appendChild(el('p', null, '<strong>' + esc(row[0]) + ':</strong> ' + esc(row[1]) + fn.cite(row[2])));
      });
      if (d.governmentSchemes && d.governmentSchemes.length) {
        sec.appendChild(el('h3', null, 'Key government schemes'));
        var ul = el('ul');
        d.governmentSchemes.forEach(function (s) {
          ul.appendChild(el('li', null, '<strong>' + esc(s.name) + '.</strong> ' + esc(s.detail) + fn.cite(s.source)));
        });
        sec.appendChild(ul);
      }
    });

    // 7. Distribution
    section('distribution', 'Who Can Sell You Insurance', function (sec, fn) {
      var d = data.distribution || {};
      if (d.title) sec.appendChild(el('p', null, esc(d.title) + fn.cite(d.source)));
      if (d.channels && d.channels.length) {
        var dl = el('dl', 'guide-deflist');
        d.channels.forEach(function (c) {
          dl.appendChild(el('dt', null, esc(c.name) + fn.cite(c.source)));
          dl.appendChild(el('dd', null, esc(c.detail)));
        });
        sec.appendChild(dl);
      }
      if (d.tip) sec.appendChild(callout('info', 'Tip', d.tip));
    });

    // 8. Insurers
    section('insurers', 'Insurers Licensed in India', function (sec, fn) {
      var d = data.insurers || {};
      if (d.sourceNote) sec.appendChild(callout('info', 'Important', d.sourceNote + fn.cite(d.sourceNoteSource || 'IRDAI')));

      var groups = [['life', 'Life Insurers'], ['general', 'General Insurers'],
                    ['healthStandalone', 'Standalone Health Insurers'], ['reinsurers', 'Reinsurers']];
      var filters = el('div', 'guide-filters');
      var tableWrap = el('div');

      function buildTable(key) {
        var arr = d[key] || [];
        var tbl = el('table', 'guide-table');
        tbl.innerHTML = '<thead><tr><th>Insurer</th><th>Sector</th><th>Base</th><th>Since</th><th>Link</th></tr></thead>';
        var tb = el('tbody');
        arr.forEach(function (it) {
          var tr = el('tr');
          var link = it.website ? '<a href="' + esc(it.website) + '" target="_blank" rel="noopener noreferrer">visit ↗</a>' : '—';
          tr.innerHTML =
            '<td><strong>' + esc(it.name) + '</strong>' + (it.notes ? '<br><span class="guide-muted">' + esc(it.notes) + '</span>' : '') + '</td>' +
            '<td><span class="sector-tag">' + esc(it.sector) + '</span></td>' +
            '<td>' + esc(it.base || '—') + '</td>' +
            '<td>' + fmtYear(it.founded) + '</td>' +
            '<td>' + link + '</td>';
          tb.appendChild(tr);
        });
        tbl.appendChild(tb);
        return tbl;
      }

      groups.forEach(function (g, idx) {
        var btn = el('button', 'guide-filter' + (idx === 0 ? ' active' : ''), esc(g[1]) + ' (' + ((d[g[0]] || []).length) + ')');
        btn.setAttribute('data-key', g[0]);
        btn.addEventListener('click', function () {
          filters.querySelectorAll('.guide-filter').forEach(function (b) { b.classList.remove('active'); });
          btn.classList.add('active');
          tableWrap.innerHTML = '';
          tableWrap.appendChild(buildTable(g[0]));
        });
        filters.appendChild(btn);
        if (idx === 0) tableWrap.appendChild(buildTable(g[0]));
      });

      sec.appendChild(filters);
      sec.appendChild(tableWrap);
    });

    // 9. Glossary
    section('glossary', 'Glossary — A to Z', function (sec, fn) {
      var list = data.glossary || [];
      var dl = el('dl', 'guide-deflist');
      list.forEach(function (g) {
        dl.appendChild(el('dt', null, esc(g.term) + fn.cite(g.source)));
        dl.appendChild(el('dd', null, esc(g.meaning)));
      });
      sec.appendChild(dl);
    });

    layout.appendChild(rail);
    layout.appendChild(content);
    root.appendChild(layout);

    // Internal anchor scrolling (smooth, offset for sticky header)
    rail.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(a.getAttribute('data-target'));
        if (target) {
          var top = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      });
    });

    setupScrollSpy(rail, builtSections);
  }

  function setupScrollSpy(rail, sections) {
    var links = Array.prototype.slice.call(rail.querySelectorAll('a'));
    function onScroll() {
      var pos = window.scrollY + 120;
      var current = sections[0];
      sections.forEach(function (s) { if (s.offsetTop <= pos) current = s; });
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('data-target') === (current && current.id));
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function showError(msg) {
    root.innerHTML = '';
    root.appendChild(el('div', 'guide-error', esc(msg)));
  }

  fetch('data/insurance-knowledge.json', { mode: 'same-origin' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(render)
    .catch(function (e) { showError('Could not load the knowledge base. ' + e.message); });
})();
