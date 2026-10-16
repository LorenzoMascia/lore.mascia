/* Portfolio behavior: terminal, reveal, experience tabs, navigation and system graph. */
(function () {
  // ---- props (from the design's data-props defaults) ----
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { var savedMotion = localStorage.getItem('portfolio-motion'); if (savedMotion) reducedMotion = savedMotion === 'reduced'; } catch (_) {}
  document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
  var PROPS = { accent: '#00b3cc', animations: !reducedMotion, systemNodes: 12 };
  window.addEventListener('portfolio:motion', function (event) {
    PROPS.animations = !event.detail.reduced;
    if (!PROPS.animations) { clearInterval(typeTimer); typedEl.textContent = full; }
    if (overlay && overlay.style.display !== 'none') startSim();
  });

  // ---- accent theming ----
  function applyAccent() {
    var a = PROPS.accent;
    var r = document.documentElement.style;
    r.setProperty('--accent', a);
    r.setProperty('--accent-text', 'color-mix(in oklch, ' + a + ' 68%, #05343d)');
  }
  applyAccent();

  // ---- style-hover shim ----
  document.querySelectorAll('[style-hover]').forEach(function (el) {
    var decls = el.getAttribute('style-hover').split(';').map(function (d) {
      var i = d.indexOf(':');
      if (i < 0) return null;
      return { prop: d.slice(0, i).trim(), val: d.slice(i + 1).trim() };
    }).filter(Boolean);
    var saved = null;
    el.addEventListener('mouseenter', function () {
      saved = decls.map(function (d) { return el.style.getPropertyValue(d.prop); });
      decls.forEach(function (d) { el.style.setProperty(d.prop, d.val); });
    });
    el.addEventListener('mouseleave', function () {
      if (!saved) return;
      decls.forEach(function (d, i) {
        if (saved[i]) el.style.setProperty(d.prop, saved[i]);
        else el.style.removeProperty(d.prop);
      });
    });
  });

  // ---- typed terminal ----
  var typedEl = document.getElementById('typed');
  var full = './lorenzo --stack ai · software · hardware';
  if (PROPS.animations) {
    typedEl.textContent = '';
    var i = 0;
    var typeTimer = setInterval(function () {
      i++;
      typedEl.textContent = full.slice(0, i);
      if (i >= full.length) clearInterval(typeTimer);
    }, 42);
  } else {
    typedEl.textContent = full;
  }

  // ---- scroll reveal ----
  if (PROPS.animations && 'IntersectionObserver' in window) {
    requestAnimationFrame(function () {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'none';
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.85 || el.closest('#software')) return;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity .8s cubic-bezier(.2,.6,.2,1), transform .8s cubic-bezier(.2,.6,.2,1)';
        io.observe(el);
      });
    });
  }

  // ---- magnet buttons ----
  document.querySelectorAll('[data-magnet]').forEach(function (el) {
    el.addEventListener('mousemove', function (ev) {
      if (!PROPS.animations || !window.matchMedia('(pointer: fine)').matches) return;
      var r = el.getBoundingClientRect();
      var dx = (ev.clientX - r.left - r.width / 2) / r.width;
      var dy = (ev.clientY - r.top - r.height / 2) / r.height;
      el.style.transform = 'translate(' + (dx * 7).toFixed(1) + 'px, ' + (dy * 5).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transform = 'translate(0,0)'; });
  });

  // ---- experience tabs ----
  var tabData = [
    {
      label: 'Ericsson',
      role: 'Product Developer · Ericsson',
      meta: 'Aug 2025 — Present · Naples, Italy',
      bullets: [
        'Contribute to product development for telecom and network-operations software.',
        'Work on machine-learning systems for alarm correlation and root-cause-analysis workflows.',
        'Contribute to generative-AI experiences for exploring operational data through natural-language interactions and dashboards.'
      ]
    },
    {
      label: 'Ericsson Intern',
      role: 'Integration Engineer Intern · Ericsson',
      meta: 'Jan 2025 — Jul 2025 · Naples, Italy',
      bullets: [
        'Supported software integration and validation in a production telecom environment.',
        'Progressed from a six-month internship to a permanent Product Developer position.'
      ]
    },
    {
      label: 'International',
      role: 'Exchange Program · Madrid and Porto',
      meta: 'UPM ETSIDI 2022–2023 · FEUP 2026',
      bullets: [
        'Completed a full academic year at ETSIDI, Universidad Politécnica de Madrid, during my bachelor\'s degree.',
        'Completed a master\'s exchange at the Faculty of Engineering of the University of Porto alongside full-time work, travelling to Porto for academic activities and assessments.'
      ]
    },
    {
      label: 'Education',
      role: 'Management Engineering · Parthenope',
      meta: 'BSc completed 2024 · MSc 2024 — Present',
      bullets: [
        'Master\'s degree focused on the technical and managerial design of complex industrial and energy systems.',
        'Bachelor\'s thesis: Indoor Tracking System for Retail Customers — an end-to-end IoT, localization and behavioral-clustering prototype.',
        'Completed a curricular internship connected to the experimental thesis, covering hardware, embedded firmware, backend events and technical documentation.'
      ]
    }
  ];
  var baseTab = 'font-family: \'IBM Plex Mono\', monospace; font-size: 13px; letter-spacing: .04em; text-align: left; padding: 13px 20px; background: transparent; border: none; border-left: 2px solid #e4decd; color: #5b6367; cursor: pointer; transition: all .2s;';
  var activeTab = 'font-family: \'IBM Plex Mono\', monospace; font-size: 13px; letter-spacing: .04em; text-align: left; padding: 13px 20px; border: none; cursor: pointer; transition: all .2s; border-left: 2px solid ' + PROPS.accent + '; color: #191d1f; background: rgba(0,179,204,.06);';
  var curTab = 0;
  var tabsHost = document.getElementById('expTabs');
  var roleEl = document.getElementById('expRole');
  var metaEl = document.getElementById('expMeta');
  var bulletsEl = document.getElementById('expBullets');

  tabsHost.setAttribute('role', 'tablist');
  tabsHost.setAttribute('aria-label', 'Experience');
  tabsHost.setAttribute('aria-orientation', window.innerWidth <= 800 ? 'horizontal' : 'vertical');
  var experiencePanel = roleEl.parentElement;
  experiencePanel.classList.add('experience-panel');
  experiencePanel.id = 'experiencePanel';
  experiencePanel.setAttribute('role', 'tabpanel');
  experiencePanel.tabIndex = 0;
  tabData.forEach(function (d, idx) {
    var b = document.createElement('button');
    b.textContent = d.label;
    b.id = 'experienceTab' + idx;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'experiencePanel');
    b.addEventListener('keydown', function (event) {
      var next = idx;
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (idx + 1) % tabData.length;
      else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (idx - 1 + tabData.length) % tabData.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabData.length - 1;
      else return;
      event.preventDefault(); setTab(next); tabsHost.children[next].focus();
    });
    b.addEventListener('click', function () { setTab(idx); });
    tabsHost.appendChild(b);
  });

  function setTab(t) {
    curTab = t;
    experiencePanel.setAttribute('aria-labelledby', 'experienceTab' + t);
    experiencePanel.classList.remove('is-switching');
    if (PROPS.animations) requestAnimationFrame(function () { experiencePanel.classList.add('is-switching'); });
    Array.prototype.forEach.call(tabsHost.children, function (btn, idx) {
      btn.setAttribute('style', idx === t ? activeTab : baseTab);
      btn.setAttribute('aria-selected', idx === t ? 'true' : 'false');
      btn.tabIndex = idx === t ? 0 : -1;
    });
    var d = tabData[t];
    roleEl.textContent = d.role;
    metaEl.textContent = d.meta;
    bulletsEl.innerHTML = '';
    d.bullets.forEach(function (text) {
      var row = document.createElement('div');
      row.setAttribute('style', 'display: flex; gap: 14px; font-size: 15.5px; line-height: 1.65; color: #33393c; max-width: 640px;');
      var mark = document.createElement('span');
      mark.setAttribute('style', 'color: var(--accent, #00b3cc); flex-shrink: 0; margin-top: 1px;');
      mark.textContent = '▹';
      var span = document.createElement('span');
      span.textContent = text;
      row.appendChild(mark);
      row.appendChild(span);
      bulletsEl.appendChild(row);
    });
  }
  setTab(0);

  // ---- section step navigation ----
  var sectionIds = ['top', 'about', 'experience', 'software', 'hardware', 'experiments', 'writing', 'contact'];
  function goto(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var nav = document.querySelector('nav');
    var navHeight = nav ? nav.getBoundingClientRect().height : 0;
    var target = el.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top: Math.max(0, target), behavior: PROPS.animations ? 'smooth' : 'auto' });
  }
  function sectionStep(dir) {
    var y = window.scrollY + window.innerHeight / 2;
    var cur = 0;
    sectionIds.forEach(function (id, i) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= y) cur = i;
    });
    var next = Math.max(0, Math.min(sectionIds.length - 1, cur + dir));
    if (next === 0) window.scrollTo({ top: 0, behavior: PROPS.animations ? 'smooth' : 'auto' });
    else goto(sectionIds[next]);
  }
  document.getElementById('sectionUp').addEventListener('click', function () { sectionStep(-1); });
  document.getElementById('sectionDown').addEventListener('click', function () { sectionStep(1); });
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href').slice(1);
      if (sectionIds.indexOf(id) === -1) return;
      event.preventDefault();
      if (link.closest('.system-navigation')) closeSystem();
      goto(id);
      history.replaceState(null, '', '#' + id);
    });
  });
  if (location.hash && sectionIds.indexOf(location.hash.slice(1)) !== -1) {
    requestAnimationFrame(function () { goto(location.hash.slice(1)); });
  }

  // ---- SYSTEM MODE ----
  var overlay = document.getElementById('systemOverlay');
  var canvas = document.getElementById('systemCanvas');
  var sim = { raf: 0, cleanup: null };

  var systemReturnFocus = null;
  function setBackgroundInert(inert) {
    document.querySelectorAll('.portfolio-shell > nav, .portfolio-shell > header, .portfolio-shell > section, .portfolio-shell > footer, [data-mq="arrows"]').forEach(function (el) { el.inert = inert; });
  }
  function openSystem() {
    systemReturnFocus = document.activeElement;
    overlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
    setBackgroundInert(true);
    document.getElementById('closeSystemBtn').focus();
    startSim();
  }
  function closeSystem() {
    stopSim();
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    setBackgroundInert(false);
    if (systemReturnFocus) systemReturnFocus.focus({ preventScroll: true });
  }

  function stopSim() {
    cancelAnimationFrame(sim.raf);
    sim.raf = 0;
    if (sim.cleanup) { sim.cleanup(); sim.cleanup = null; }
  }

  function startSim() {
    stopSim();
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var accent = PROPS.accent;
    var hexA = function (hex, a) {
      var n = parseInt(hex.slice(1), 16);
      return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    };
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var fit = function () { canvas.width = canvas.offsetWidth * dpr; canvas.height = canvas.offsetHeight * dpr; if (step && !sim.raf) sim.raf = requestAnimationFrame(step); };
    fit();
    var W = function () { return canvas.width / dpr; };
    var H = function () { return canvas.height / dpr; };
    var hubs = [
      { label: 'AI', t: 'software', fx: .30, fy: .34 },
      { label: 'SOFTWARE', t: 'software', fx: .68, fy: .28 },
      { label: 'HARDWARE', t: 'hardware', fx: .32, fy: .72 },
      { label: 'RESEARCH', t: 'writing', fx: .70, fy: .68 }
    ];
    var sats = [
      ['NL Analytics Dashboard', 0, 'software'], ['CorrelAI', 0, 'software'], ['WASM RAG', 0, 'software'],
      ['LifeQuest / QuestCore', 1, 'software'], ['NL2Py', 1, 'experiments'], ['LLM Distillery', 1, 'software'],
      ['Cloud Rush', 1, 'experiments'], ['IR Transmitter', 2, 'hardware'], ['IR Receiver', 2, 'hardware'],
      ['Vinted AutoLister', 1, 'experiments'], ['howai.cloud', 3, 'writing'], ['Indoor Tracking', 2, 'hardware']
    ].slice(0, Math.round(PROPS.systemNodes));
    var nodes = hubs.map(function (h) { return { label: h.label, t: h.t, fx: h.fx, fy: h.fy, hub: true, r: 8, x: h.fx * W(), y: h.fy * H(), vx: 0, vy: 0 }; });
    sats.forEach(function (s, i) {
      var p = nodes[s[1]];
      var a = i * 2.399 + s[1] * 1.3;
      var d = Math.min(105 + (i % 3) * 48, W() * .22);
      nodes.push({ label: s[0], t: s[2], hub: false, r: 4.5, parent: s[1], ang: a, dist: d, x: p.x + Math.cos(a) * d, y: p.y + Math.sin(a) * d, vx: 0, vy: 0 });
    });
    var mouse = { x: -9999, y: -9999 };
    var hovered = null;
    var onMove = function (e) { var r = canvas.getBoundingClientRect(); mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; if (!sim.raf) sim.raf = requestAnimationFrame(step); };
    var onLeave = function () { mouse = { x: -9999, y: -9999 }; if (!sim.raf) sim.raf = requestAnimationFrame(step); };
    var onClick = function (event) {
      onMove(event);
      hovered = nodes.find(function (node) { return Math.hypot(mouse.x - node.x, mouse.y - node.y) < node.r + 20; });
      if (hovered) { var t = hovered.t; closeSystem(); setTimeout(function () { goto(t); }, 80); }
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    canvas.addEventListener('click', onClick);
    window.addEventListener('resize', fit);
    sim.cleanup = function () {
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', fit);
    };
    var line = function (a, b) { ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); };
    var step = function (now) {
      sim.raf = 0;
      var t = PROPS.animations ? now / 1000 : 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#0a1014';
      ctx.fillRect(0, 0, W(), H());
      nodes.forEach(function (n, i) {
        var ax, ay;
        if (n.hub) {
          ax = n.fx * W() + Math.sin(t * .5 + i * 2.1) * 12;
          ay = n.fy * H() + Math.cos(t * .4 + i * 1.7) * 12;
        } else {
          var p = nodes[n.parent];
          var a = n.ang + t * .06;
          ax = p.x + Math.cos(a) * n.dist;
          ay = p.y + Math.sin(a) * n.dist;
        }
        var dx = mouse.x - n.x, dy = mouse.y - n.y;
        var md = Math.hypot(dx, dy);
        if (PROPS.animations && md < 240 && md > 1) {
          var f = (1 - md / 240) * (n.hub ? 14 : 34);
          ax += (dx / md) * f;
          ay += (dy / md) * f;
        }
        if (PROPS.animations) {
          n.vx = (n.vx + (ax - n.x) * .022) * .86;
          n.vy = (n.vy + (ay - n.y) * .022) * .86;
          n.x += n.vx;
          n.y += n.vy;
        } else { n.x = ax; n.y = ay; }
        n.x = Math.max(50, Math.min(W() - 50, n.x));
        n.y = Math.max(100, Math.min(H() - 110, n.y));
      });
      hovered = null;
      for (var k = 0; k < nodes.length; k++) {
        if (Math.hypot(mouse.x - nodes[k].x, mouse.y - nodes[k].y) < nodes[k].r + 11) { hovered = nodes[k]; break; }
      }
      canvas.style.cursor = hovered ? 'pointer' : 'crosshair';
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(125,150,160,.10)';
      for (var a2 = 0; a2 < 4; a2++) for (var j = a2 + 1; j < 4; j++) line(nodes[a2], nodes[j]);
      nodes.forEach(function (n) {
        if (!n.hub) { ctx.strokeStyle = hexA(accent, .15); line(n, nodes[n.parent]); }
      });
      nodes.forEach(function (n) {
        var hov = hovered === n;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + (hov ? 2.5 : 0), 0, 7);
        if (n.hub) {
          ctx.fillStyle = accent;
          ctx.shadowColor = accent;
          ctx.shadowBlur = 20;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = '#0a1014';
          ctx.fill();
          ctx.strokeStyle = hov ? accent : hexA(accent, .7);
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.textAlign = 'center';
        if (n.hub) {
          ctx.font = "600 12px 'IBM Plex Mono', monospace";
          ctx.fillStyle = '#e8f4f6';
          ctx.fillText(n.label, n.x, n.y - n.r - 12);
        } else {
          ctx.font = "11px 'IBM Plex Mono', monospace";
          ctx.fillStyle = hov ? '#e8f4f6' : 'rgba(160,180,188,.5)';
          ctx.fillText(n.label, n.x, n.y - n.r - 9);
        }
      });
      if (hovered) {
        ctx.font = "11px 'IBM Plex Mono', monospace";
        ctx.fillStyle = accent;
        ctx.fillText('→ open #' + hovered.t, hovered.x, hovered.y + hovered.r + 20);
      }
      if (PROPS.animations && !document.hidden) sim.raf = requestAnimationFrame(step);
    };
    sim.raf = requestAnimationFrame(step);
  }

  document.getElementById('openSystemBtn').addEventListener('click', openSystem);
  document.getElementById('closeSystemBtn').addEventListener('click', closeSystem);
  document.addEventListener('visibilitychange', function () {
    if (overlay.style.display === 'none') return;
    if (document.hidden) stopSim();
    else startSim();
  });
  window.addEventListener('keydown', function (e) {
    if (overlay.style.display === 'none') return;
    if (e.key === 'Escape') closeSystem();
    if (e.key === 'Tab') {
      var focusable = Array.from(overlay.querySelectorAll('button, a[href]'));
      var first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
