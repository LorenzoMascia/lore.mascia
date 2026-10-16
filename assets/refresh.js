/* Shared, dependency-free enhancements for the portfolio and its case study. */
(function () {
  'use strict';
  var root = document.documentElement;
  var media = window.matchMedia('(prefers-reduced-motion: reduce)');
  var savedMotion = null;
  try { savedMotion = localStorage.getItem('portfolio-motion'); } catch (_) {}
  var reduced = savedMotion ? savedMotion === 'reduced' : media.matches;

  function applyMotion() {
    root.dataset.motion = reduced ? 'reduced' : 'full';
    document.querySelectorAll('.motion-toggle').forEach(function (button) {
      button.setAttribute('aria-pressed', reduced ? 'true' : 'false');
      button.setAttribute('aria-label', reduced ? 'Enable animations' : 'Reduce animations');
      button.querySelector('.motion-label').textContent = reduced ? 'Motion reduced' : 'Motion on';
    });
    if (reduced) document.querySelectorAll('.reveal-pending').forEach(function (el) { el.classList.remove('reveal-pending'); });
    window.dispatchEvent(new CustomEvent('portfolio:motion', { detail: { reduced: reduced } }));
  }
  function toggleMotion() {
    reduced = !reduced;
    savedMotion = reduced ? 'reduced' : 'full';
    try { localStorage.setItem('portfolio-motion', savedMotion); } catch (_) {}
    applyMotion();
  }
  applyMotion();
  document.querySelectorAll('.motion-toggle').forEach(function (button) { button.addEventListener('click', toggleMotion); });
  media.addEventListener('change', function (event) { if (!savedMotion) { reduced = event.matches; applyMotion(); } });

  // One passive, frame-batched scroll update for progress and section navigation.
  var progress = document.querySelector('.reading-progress');
  var navLinks = Array.from(document.querySelectorAll('.nav-links a'));
  var sections = Array.from(document.querySelectorAll('.portfolio-shell > header[id], .portfolio-shell > section[id]'));
  var framePending = false;
  function updateScroll() {
    framePending = false;
    var range = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = 'scaleX(' + (range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0) + ')';
    document.body.classList.toggle('is-scrolled', window.scrollY > 240);
    var active = '';
    sections.forEach(function (section) { if (section.getBoundingClientRect().top <= 220) active = '#' + section.id; });
    navLinks.forEach(function (link) {
      if (link.getAttribute('href') === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }
  window.addEventListener('scroll', scheduleScroll, { passive: true });
  window.addEventListener('resize', scheduleScroll);
  window.addEventListener('load', scheduleScroll);
  updateScroll();

  var menuButton = document.getElementById('menuToggle');
  var menu = document.getElementById('navLinks');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = 'Menu +';
  }
  if (menuButton) {
    menuButton.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close −' : 'Menu +';
    });
    menu.addEventListener('click', function (event) { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('click', function (event) { if (!event.target.closest('.site-nav')) closeMenu(); });
    window.addEventListener('keydown', function (event) { if (event.key === 'Escape' && menu.classList.contains('is-open')) { closeMenu(); menuButton.focus(); } });
    window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);
  }

  var domains = {
    hardware: { lines: ['Ideas you can hold.', 'Embedded devices & connected systems.'], target: '#hardware', label: 'Explore connected hardware' },
    software: { lines: ['From logic to experience.', 'Interfaces, tools & working products.'], target: '#software', label: 'Explore software projects' },
    ai: { lines: ['Making intelligence useful.', 'ML systems, LLMs & experiments.'], target: '#software', label: 'Explore applied AI projects' },
    product: { lines: ['Connecting the whole picture.', 'From the first prototype to LifeQuest.'], target: '#software', label: 'Explore product development' }
  };
  var domainButtons = document.querySelectorAll('[data-domain]');
  domainButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var domain = domains[button.dataset.domain];
      domainButtons.forEach(function (other) { other.setAttribute('aria-pressed', String(other === button)); });
      var caption = document.getElementById('domainCaption');
      caption.replaceChildren(document.createTextNode(domain.lines[0]), document.createElement('br'), document.createTextNode(domain.lines[1]));
      var link = document.getElementById('domainLink');
      link.href = domain.target;
      link.setAttribute('aria-label', domain.label);
    });
  });

  // Offscreen decoration stops animating; content stays readable without JavaScript.
  if ('IntersectionObserver' in window) {
    var orbital = document.querySelector('.orbital');
    if (orbital) {
      var orbitObserver = new IntersectionObserver(function (entries) {
        orbital.classList.toggle('orbit-paused', !entries[0].isIntersecting);
      });
      orbitObserver.observe(orbital);
    }
    var timeline = document.querySelector('[data-mq="timeline-scroll"]');
    if (timeline) {
      var timelineObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { timeline.classList.add('timeline-enter'); timelineObserver.disconnect(); }
      }, { threshold: .2 });
      timelineObserver.observe(timeline);
    }
    if (document.body.classList.contains('case-study') && !reduced) {
      var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); revealObserver.unobserve(entry.target); } });
      }, { threshold: .08 });
      document.querySelectorAll('[data-reveal]').forEach(function (el) {
        if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('reveal-pending'); revealObserver.observe(el); }
      });
    }
  }

  function closeOnBackdrop(dialog, event) { if (event.target === dialog) { var rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }
  function scrollToSection(id) {
    closeMenu();
    var section = document.getElementById(id);
    if (!section) return;
    var nav = document.querySelector('nav');
    var offset = nav ? nav.getBoundingClientRect().height + 20 : 20;
    window.scrollTo({ top: Math.max(0, window.scrollY + section.getBoundingClientRect().top - offset), behavior: reduced ? 'auto' : 'smooth' });
    history.replaceState(null, '', '#' + id);
  }

  var commandButton = document.getElementById('openCommands');
  if (commandButton && typeof HTMLDialogElement !== 'undefined') {
    var dialog = document.createElement('dialog');
    dialog.className = 'command-dialog';
    dialog.setAttribute('aria-labelledby', 'commandTitle');
    dialog.innerHTML = '<div class="command-heading"><h2 id="commandTitle">QUICK NAVIGATION</h2><button class="dialog-close" type="button" aria-label="Close quick navigation">ESC ×</button></div><input class="command-input" type="search" aria-label="Search pages and actions" placeholder="Where would you like to go?" autocomplete="off" spellcheck="false" aria-controls="commandResults"><div class="command-list" id="commandResults" role="group" aria-label="Matching actions"></div><p class="command-empty" hidden>No matching actions. Try “work” or “contact”.</p><p class="command-help">↑ ↓ to choose · Enter to go · Esc to close</p>';
    document.body.appendChild(dialog);
    var input = dialog.querySelector('input');
    var results = dialog.querySelector('.command-list');
    var selection = 0;
    var visibleActions = [];
    var actions = [
      { name: 'Back to the beginning', hint: '00 / home', words: 'top home hero', run: function () { scrollToSection('top'); } },
      { name: 'About Lorenzo', hint: '01 / about', words: 'profile stack skills', run: function () { scrollToSection('about'); } },
      { name: 'Experience & education', hint: '02 / journey', words: 'ericsson work career', run: function () { scrollToSection('experience'); } },
      { name: 'Selected projects', hint: '03 / software', words: 'work ai lifequest correlai rag', run: function () { scrollToSection('software'); } },
      { name: 'Connected hardware', hint: '04 / hardware', words: 'esp32 indoor tracking thesis', run: function () { scrollToSection('hardware'); } },
      { name: 'Other experiments', hint: '05 / lab', words: 'nl2py cloud rush llm vinted', run: function () { scrollToSection('experiments'); } },
      { name: 'Thinking in public', hint: '06 / writing', words: 'howai articles blog research', run: function () { scrollToSection('writing'); } },
      { name: 'Get in touch', hint: '07 / contact', words: 'email hello connect', run: function () { scrollToSection('contact'); } },
      { name: 'Explore System Mode', hint: 'interactive map', words: 'graph nodes connections', run: function () { document.getElementById('openSystemBtn').click(); } },
      { name: 'Download CV', hint: 'PDF', words: 'resume curriculum', run: function () { document.querySelector('a[download]').click(); } },
      { name: 'Toggle animations', hint: 'motion preference', words: 'reduce motion pause accessibility', run: toggleMotion }
    ];
    function choose(index) {
      selection = index;
      Array.from(results.children).forEach(function (button, i) { button.classList.toggle('is-selected', i === selection); });
    }
    function renderActions() {
      var query = input.value.trim().toLowerCase();
      visibleActions = actions.filter(function (action) { return (action.name + ' ' + action.hint + ' ' + action.words).toLowerCase().includes(query); });
      results.replaceChildren();
      visibleActions.forEach(function (action) {
        var button = document.createElement('button');
        button.type = 'button';
        var label = document.createElement('span'); label.textContent = action.name;
        var hint = document.createElement('span'); hint.textContent = action.hint;
        button.append(label, hint);
        button.addEventListener('click', function () { dialog.close(); action.run(); });
        results.appendChild(button);
      });
      dialog.querySelector('.command-empty').hidden = visibleActions.length !== 0;
      choose(0);
    }
    function openCommands() {
      if (document.getElementById('systemOverlay').style.display !== 'none') return;
      closeMenu();
      input.value = '';
      renderActions();
      dialog.showModal();
      input.focus();
    }
    commandButton.addEventListener('click', openCommands);
    dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (event) { closeOnBackdrop(dialog, event); });
    input.addEventListener('input', renderActions);
    input.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (!visibleActions.length) return;
        choose((selection + (event.key === 'ArrowDown' ? 1 : -1) + visibleActions.length) % visibleActions.length);
        results.children[selection].scrollIntoView({ block: 'nearest' });
      }
      if (event.key === 'Enter' && visibleActions[selection]) { event.preventDefault(); dialog.close(); visibleActions[selection].run(); }
    });
    window.addEventListener('keydown', function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (dialog.open) dialog.close(); else openCommands(); }
    });
    if (/Mac|iPhone|iPad/.test(navigator.platform)) document.getElementById('commandShortcut').textContent = '⌘ K';
  }

  // Inspect original prototype photos and sketches without leaving the case study.
  if (document.body.classList.contains('case-study') && typeof HTMLDialogElement !== 'undefined') {
    var imageDialog = document.createElement('dialog');
    imageDialog.className = 'image-dialog';
    imageDialog.setAttribute('aria-label', 'Prototype image viewer');
    imageDialog.innerHTML = '<div class="command-heading"><span class="mono" style="font-size:10px; color:#62696d;">FROM THE BUILD LOG</span><button class="dialog-close" aria-label="Close image viewer" type="button">ESC ×</button></div><img alt=""><p></p>';
    document.body.appendChild(imageDialog);
    imageDialog.querySelector('button').addEventListener('click', function () { imageDialog.close(); });
    imageDialog.addEventListener('click', function (event) { closeOnBackdrop(imageDialog, event); });
    document.querySelectorAll('figure img').forEach(function (image) {
      var button = document.createElement('button');
      button.className = 'image-zoom';
      button.type = 'button';
      button.setAttribute('aria-label', 'Enlarge: ' + image.alt);
      button.setAttribute('aria-haspopup', 'dialog');
      image.before(button);
      button.appendChild(image);
      var caption = image.closest('figure').querySelector('figcaption');
      if (caption) caption.appendChild(document.createTextNode(' · click to inspect ↗'));
      button.addEventListener('click', function () {
        var large = imageDialog.querySelector('img');
        large.src = image.src;
        large.alt = image.alt;
        imageDialog.querySelector('p').textContent = image.alt;
        imageDialog.showModal();
      });
    });
    document.querySelectorAll('main img').forEach(function (image, index) { if (index > 1) image.loading = 'lazy'; });
  }
})();
