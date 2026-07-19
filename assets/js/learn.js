(function () {
  'use strict';

  var STORE_KEY = 'bimaniti-learn';

  // ---- SVG illustration library (single accent color, editorial style) ----
  var ACCENT = '#4a6741';
  var MUTED = '#8a8a84';
  var ILLUS = {
    scooter: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="30" cy="58" r="14"/><circle cx="92" cy="58" r="14"/><path d="M30 58 L52 30 L88 30 M52 30 L60 58 M88 30 L92 58"/><path d="M60 20 h22" /><rect x="78" y="14" width="10" height="8" rx="2"/></svg>',
    car: '<svg viewBox="0 0 120 70" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 48 L26 30 H72 L92 48 Z"/><path d="M26 30 L36 22 H66 L72 30"/><circle cx="34" cy="50" r="9"/><circle cx="82" cy="50" r="9"/><path d="M92 48 h10 v-6"/></svg>',
    hospital: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="20" width="72" height="48" rx="3"/><path d="M60 28 v32 M44 44 h32"/><path d="M14 68 h92"/></svg>',
    house: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 68 V40 L60 18 L100 40 V68 Z"/><path d="M48 68 V50 H72 V68"/><path d="M28 40 L60 24 L92 40"/></svg>',
    plane: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50 L100 34 L108 38 L40 56 L70 66 L62 70 L30 60 L18 62 Z"/><path d="M40 56 L34 66"/></svg>',
    laptop: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="28" y="18" width="64" height="40" rx="3"/><path d="M16 66 H104 L96 58 H24 Z"/><path d="M44 30 h32 M44 38 h24" stroke="#8a8a84"/></svg>',
    riverbed: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 60 Q40 50 60 60 T110 58"/><circle cx="78" cy="40" r="10"/><path d="M78 50 l-6 10 M78 50 l6 10 M68 40 h20" stroke="#8a8a84"/><path d="M30 30 q6 -8 12 0" stroke="#8a8a84"/></svg>',
    warning: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 14 L104 66 H16 Z"/><path d="M60 32 v18 M60 56 h.5"/></svg>',
    check: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="40" r="26"/><path d="M46 40 L56 50 L76 30"/></svg>',
    split: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 14 V40 M60 40 L30 66 M60 40 L90 66"/><circle cx="60" cy="12" r="4" fill="#4a6741"/><circle cx="30" cy="68" r="4" fill="#4a6741"/><circle cx="90" cy="68" r="4" fill="#4a6741"/></svg>',
    bundle: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="26" y="24" width="30" height="34" rx="3"/><rect x="64" y="24" width="30" height="34" rx="3"/><path d="M41 41 h30" stroke="#8a8a84"/></svg>',
    idv: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="22" width="60" height="38" rx="4"/><path d="M40 36 h40 M40 46 h28" stroke="#8a8a84"/><path d="M86 22 v-6 h-52 v6"/></svg>',
    crash: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 56 L40 40 H70"/><circle cx="30" cy="58" r="10"/><circle cx="78" cy="58" r="10"/><path d="M70 40 L82 56" stroke-dasharray="4 4"/><path d="M48 30 l-6 -8 M56 28 l4 -10"/></svg>',
    survey: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="44" cy="40" r="16"/><path d="M56 52 L72 68"/><path d="M38 40 h12 M44 34 v12" stroke="#8a8a84"/></svg>',
    cashless: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="28" y="22" width="42" height="30" rx="3"/><path d="M34 32 h30 M34 40 h20" stroke="#8a8a84"/><path d="M82 30 l8 8 l14 -16"/><path d="M82 58 h22" stroke="#8a8a84"/></svg>',
    deductible: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="40" r="26"/><path d="M44 40 h32" stroke="#b94040"/><path d="M52 28 a14 14 0 0 1 16 0" stroke="#8a8a84"/></svg>',
    drink: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M44 18 h32 l-4 44 a12 12 0 0 1 -24 0 Z"/><path d="M40 30 h40" stroke="#8a8a84"/><path d="M60 50 v14"/></svg>',
    locks: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="42" y="36" width="36" height="30" rx="4"/><path d="M48 36 v-8 a12 12 0 0 1 24 0 v8"/><circle cx="60" cy="50" r="4"/><path d="M60 54 v6"/></svg>',
    addons: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="24" width="60" height="32" rx="3"/><path d="M30 32 h60" stroke="#8a8a84"/><path d="M44 48 l6 6 l12 -14"/><path d="M84 24 l6 -6 v12" stroke="#8a8a84"/></svg>',
    rti: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M40 64 V36 a20 20 0 0 1 40 0 V64"/><path d="M32 64 h56"/><path d="M50 50 h20 M50 42 a10 10 0 0 1 20 0" stroke="#8a8a84"/></svg>',
    ncb: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 16 l10 22 24 2 -18 16 6 24 -22 -13 -22 13 6 -24 -18 -16 24 -2 Z" stroke="#8a8a84"/><path d="M48 44 h24 M60 32 v24" stroke="#4a6741"/></svg>',
    compare: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M30 60 V28 M30 28 L46 44 M30 28 L46 28"/><path d="M90 60 V28 M90 28 L74 44 M90 28 L74 28"/></svg>',
    umbrella: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 40 a40 30 0 0 1 80 0 Z"/><path d="M60 40 V64 M60 64 q-8 4 -14 -2"/></svg>',
    sumassured: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="40" r="24"/><path d="M60 28 v24 M48 40 h24" stroke="#8a8a84"/><path d="M84 40 h12" /></svg>',
    nominee: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="30" r="12"/><path d="M40 66 q20 -26 40 0"/></svg>',
    fire: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 16 q12 18 0 30 q-12 -6 0 -30 Z"/><path d="M48 66 q12 -14 24 0" stroke="#8a8a84"/><path d="M40 66 h40"/></svg>',
    flood: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 50 q15 -8 30 0 t30 0 t30 0"/><path d="M10 60 q15 -8 30 0 t30 0 t30 0" stroke="#8a8a84"/><path d="M50 18 h20 v24 h-20 Z" stroke="#8a8a84"/></svg>',
    bag: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="38" y="30" width="44" height="34" rx="4"/><path d="M48 30 v-6 a12 12 0 0 1 24 0 v6"/><path d="M38 42 h44" stroke="#8a8a84"/></svg>',
    cancel: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="60" cy="40" r="24"/><path d="M48 28 L72 52 M72 28 L48 52"/></svg>',
    fraud: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#b94040" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="34" y="26" width="52" height="32" rx="3"/><path d="M34 34 h52" stroke="#8a8a84"/><path d="M44 44 h22" stroke-dasharray="4 4"/><circle cx="84" cy="50" r="8"/></svg>',
    identity: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="48" cy="34" r="10"/><path d="M32 62 q16 -20 32 0"/><rect x="70" y="26" width="28" height="30" rx="3"/><path d="M76 36 h16 M76 44 h12" stroke="#8a8a84"/></svg>',
    card: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="22" width="72" height="40" rx="5"/><path d="M24 34 h72" stroke="#8a8a84"/><rect x="32" y="42" width="14" height="10" rx="2" stroke="#8a8a84"/><path d="M82 46 h8"/></svg>',
    ped: '<svg viewBox="0 0 120 80" width="100%" height="100%" fill="none" stroke="#4a6741" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M60 18 v22 l-10 10 M60 40 l10 14"/><circle cx="60" cy="60" r="12"/><path d="M60 14 a4 4 0 0 1 0 8" stroke="#8a8a84"/></svg>'
  };

  // ---- helpers ----
  function escapeHtml(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(str));
    return d.innerHTML;
  }

  function loadStore() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch (e) { return {}; }
  }
  function saveStore(s) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
  }
  function markComplete(trackId, levelId) {
    var s = loadStore();
    s[trackId] = s[trackId] || {};
    s[trackId][levelId] = true;
    saveStore(s);
  }
  function isComplete(trackId, levelId) {
    var s = loadStore();
    return !!(s[trackId] && s[trackId][levelId]);
  }
  function trackProgress(track) {
    var done = 0;
    track.levels.forEach(function (lv) { if (isComplete(track.id, lv.id)) done++; });
    return { done: done, total: track.levels.length, pct: Math.round((done / track.levels.length) * 100) };
  }

  // ---- engine state ----
  var DATA = null;
  var current = { track: null, level: null, sceneIndex: 0, levelScenes: [], results: [] };

  function findTrack(id) {
    if (!DATA) return null;
    for (var i = 0; i < DATA.tracks.length; i++) if (DATA.tracks[i].id === id) return DATA.tracks[i];
    return null;
  }
  function findLevel(track, id) {
    for (var i = 0; i < track.levels.length; i++) if (track.levels[i].id === id) return track.levels[i];
    return null;
  }

  // ---- rendering ----
  function renderScene() {
    var root = document.getElementById('learn-root');
    if (!root) return;
    var scene = current.levelScenes[current.sceneIndex];
    var total = current.levelScenes.length;
    var step = current.sceneIndex + 1;

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
    } else {
      var choices = root.querySelectorAll('.learn-choice');
      choices.forEach(function (btn) {
        btn.addEventListener('click', function () { onChoice(parseInt(btn.getAttribute('data-i'), 10)); });
      });
    }
  }

  function onChoice(i) {
    var scene = current.levelScenes[current.sceneIndex];
    var choice = scene.choices[i];
    current.results.push(choice.correct !== false);
    var fb = document.getElementById('learn-feedback');
    fb.className = 'learn-feedback ' + (choice.correct === true ? 'correct' : 'wrong');
    fb.innerHTML = escapeHtml(choice.feedback);
    fb.classList.remove('hidden');
    // disable + color choices
    var choices = document.querySelectorAll('.learn-choice');
    choices.forEach(function (b, bi) {
      b.disabled = true;
      if (bi === i) b.classList.add(choice.correct === true ? 'picked-correct' : 'picked-wrong');
    });
    // reveal scene (feedback/wrong branch)
    var revealing = findSceneById(scene.choices[i].next);
    if (revealing) {
      // show a small "See why" continue that jumps to the reveal scene
      var actions = document.createElement('div');
      actions.className = 'learn-actions';
      actions.innerHTML = '<button class="learn-btn" id="learn-next">See the explanation →</button>';
      fb.parentNode.insertBefore(actions, fb.nextSibling);
      document.getElementById('learn-next').addEventListener('click', function () {
        // jump: the next scene in array after current is the reveal; but branch may skip.
        // Simplest: render the reveal scene directly by id.
        gotoSceneById(scene.choices[i].next);
      });
    }
  }

  function findSceneById(id) {
    if (!id) return null;
    for (var i = 0; i < current.levelScenes.length; i++) {
      if (current.levelScenes[i].id === id) return current.levelScenes[i];
    }
    return null;
  }

  function gotoSceneById(id) {
    for (var i = 0; i < current.levelScenes.length; i++) {
      if (current.levelScenes[i].id === id) { current.sceneIndex = i; renderScene(); return; }
    }
    nextScene();
  }

  function nextScene() {
    if (current.sceneIndex < current.levelScenes.length - 1) {
      current.sceneIndex++;
      renderScene();
    } else {
      finishLevel();
    }
  }

  function finishLevel() {
    markComplete(current.track.id, current.level.id);
    var correct = current.results.filter(Boolean).length;
    var totalQ = current.results.length;
    var summary = document.getElementById('learn-root');
    var p = trackProgress(current.track);
    summary.innerHTML =
      '<div class="learn-complete">' +
      '<div class="learn-illus">' + (ILLUS.check) + '</div>' +
      '<h2>' + escapeHtml(current.level.title) + ' complete</h2>' +
      '<p>You answered ' + correct + ' of ' + totalQ + ' branching questions correctly.</p>' +
      '<div class="learn-actions">' +
      (nextLevelLink()) +
      '<a class="learn-btn ghost" href="learn.html">Back to tracks</a>' +
      '</div>' +
      '<p class="learn-track-progress">Track progress: ' + p.done + '/' + p.total + ' levels (' + p.pct + '%)</p>' +
      '</div>';
  }

  function nextLevelLink() {
    var levels = current.track.levels;
    var idx = -1;
    for (var i = 0; i < levels.length; i++) if (levels[i].id === current.level.id) idx = i;
    if (idx >= 0 && idx < levels.length - 1) {
      var nl = levels[idx + 1];
      var done = isComplete(current.track.id, nl.id);
      return '<a class="learn-btn" href="learn.html?track=' + current.track.id + '&level=' + nl.id + '">' +
        (done ? 'Revisit' : 'Next') + ': ' + escapeHtml(nl.title) + ' →</a>';
    }
    return '<a class="learn-btn" href="learn.html?track=' + current.track.id + '">Review ' + escapeHtml(current.track.title) + '</a>';
  }

  // ---- bootstrap ----
  function start() {
    var root = document.getElementById('learn-root');
    if (!root) return;
    if (!DATA) { root.innerHTML = '<p style="color:var(--text-muted)">Loading…</p>'; return; }

    var params = new URLSearchParams(window.location.search);
    var trackId = params.get('track');
    var levelId = params.get('level');

    if (!trackId) { renderLanding(); return; }
    var track = findTrack(trackId);
    if (!track) { renderLanding(); return; }

    // track header
    renderTrackHeader(track, levelId);

    if (!levelId) { renderLevelGrid(track); return; }
    var level = findLevel(track, levelId);
    if (!level) { renderLevelGrid(track); return; }

    if (level.scenes && level.scenes.length) {
      current.track = track;
      current.level = level;
      current.levelScenes = level.scenes;
      current.sceneIndex = 0;
      current.results = [];
      renderScene();
    } else {
      root.innerHTML = '<p style="color:var(--text-muted)">This level is coming soon.</p>' +
        '<div class="learn-actions"><a class="learn-btn ghost" href="learn.html?track=' + track.id + '">← Back to ' + escapeHtml(track.title) + '</a></div>';
    }
  }

  function renderLanding() {
    var root = document.getElementById('learn-root');
    var html = '<div class="learn-landing">';
    html += '<p class="learn-lead">Learn insurance the way it actually shows up — through stories. Pick a track, make choices, and watch the fine print decide the ending.</p>';
    html += '<div class="learn-tracks">';
    DATA.tracks.forEach(function (t) {
      var p = trackProgress(t);
      var resume = p.done > 0 && p.done < p.total ? 'Resume' : (p.done === 0 ? 'Start' : 'Review');
      html += '<a class="learn-track-card" href="learn.html?track=' + t.id + '">';
      html += '<div class="learn-track-icon">' + (ILLUS[t.icon] || ILLUS.card) + '</div>';
      html += '<h3>' + escapeHtml(t.title) + '</h3>';
      html += '<p>' + escapeHtml(t.tagline) + '</p>';
      html += '<div class="learn-track-meta"><span>4 levels</span><span class="learn-pill">' + p.done + '/' + p.total + ' done</span></div>';
      html += '<div class="learn-mini-bar"><div style="width:' + p.pct + '%"></div></div>';
      html += '<span class="learn-resume">' + resume + ' →</span>';
      html += '</a>';
    });
    html += '</div></div>';
    root.innerHTML = html;
  }

  function renderTrackHeader(track, activeLevelId) {
    var head = document.getElementById('learn-header');
    if (!head) return;
    head.innerHTML = '<a class="learn-back" href="learn.html">← All tracks</a>' +
      '<h1>' + escapeHtml(track.title) + '</h1>' +
      '<p>' + escapeHtml(track.tagline) + '</p>';
    var nav = document.getElementById('learn-levelnav');
    if (!nav) return;
    nav.innerHTML = '';
    track.levels.forEach(function (lv) {
      var done = isComplete(track.id, lv.id);
      var cls = 'learn-level-chip' + (lv.id === activeLevelId ? ' active' : '') + (done ? ' done' : '');
      var label = done ? '✓ ' : '';
      nav.innerHTML += '<a class="' + cls + '" href="learn.html?track=' + track.id + '&level=' + lv.id + '">' + label + escapeHtml(lv.title) + '</a>';
    });
  }

  function renderLevelGrid(track) {
    var root = document.getElementById('learn-root');
    var html = '<div class="learn-levelgrid">';
    track.levels.forEach(function (lv) {
      var done = isComplete(track.id, lv.id);
      var hasContent = lv.scenes && lv.scenes.length;
      html += '<a class="learn-level-card ' + (done ? 'done' : '') + '" href="learn.html?track=' + track.id + '&level=' + lv.id + '">';
      html += '<div class="learn-level-status">' + (done ? '✓ Completed' : (hasContent ? 'Start' : 'Coming soon')) + '</div>';
      html += '<h3>' + escapeHtml(lv.title) + '</h3>';
      html += '<p>' + escapeHtml(lv.intro) + '</p>';
      html += '</a>';
    });
    html += '</div>';
    root.innerHTML = html;
  }

  // ---- load data then start ----
  fetch('data/learn/tracks.json', { mode: 'same-origin' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
    .then(function (json) { DATA = json; start(); })
    .catch(function () {
      var root = document.getElementById('learn-root');
      if (root) root.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:3rem 0;">Unable to load the learning programme. Please refresh.</p>';
    });

  // expose for debugging
  window.__bimaLearn = { loadStore: loadStore };
})();
