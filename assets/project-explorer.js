/* The project overview stays usable without this optional enhancement. */
(function () {
  'use strict';
  var lanes = document.querySelector('.feature-lanes');
  if (!lanes) return;
  var catalog = {
    distillery: {
      number: '01', area: 'AI systems', scope: 'Public experiment',
      description: 'A teacher–student pipeline for synthetic dataset generation and parameter-efficient fine-tuning of a compact anonymization model.',
      focus: 'Synthetic data generation, knowledge distillation and LoRA fine-tuning connect the larger teacher model to a smaller, specialized student.'
    },
    rag: {
      number: '02', area: 'AI systems', scope: 'Open source',
      description: 'A browser-based RAG toolkit that parses documents, chunks content and performs vector search client-side through Rust and WebAssembly, with a separate interface for grounded queries.',
      focus: 'Document parsing, content chunking and local vector search run in the browser. The query interface brings retrieved context into grounded questions.'
    },
    lifequest: {
      number: '03', area: 'Product engines', scope: 'Private product',
      description: 'A local-first personal operating system that connects conversation, memory, decisions and action. A repository-centered engine where an attached AI helps evolve personal organization.',
      focus: 'I designed the product model, agent workflows, REST services and visual life maps end to end.',
      note: 'This is a private product. A public case study is still in preparation.'
    },
    emberveil: {
      number: '04', area: 'Product engines', scope: 'Game engine',
      description: 'A repository-centered game engine built around collaboration with an attached coding agent. Describe the game through a project command and the agent builds it inside the codebase.',
      focus: 'The repository is the working environment: project commands connect game ideas with a coding agent and the code it develops.',
      note: 'Get in touch to discuss the project and its workflow.'
    },
    correlai: {
      number: '05', area: 'Applied operations', scope: 'Public ML experiment',
      description: 'An independent machine-learning experiment for grouping synthetic telecom alarms and exploring root-cause analysis through temporal, spatial, semantic and feature-based correlation.',
      focus: 'Clustering and multiple views of alarm similarity support exploration of root-cause workflows using synthetic data.'
    },
    analytics: {
      number: '06', area: 'Applied operations', scope: 'Professional work',
      description: 'Contributed to an internal analytics experience that lets users explore operational data through natural-language questions and visual results inside an existing dashboard platform.',
      focus: 'My contribution connects generative AI, operational analytics and the product interface.',
      note: 'This is a public overview of confidential professional work. Internal code and architecture are not shared.'
    }
  };
  var filters = document.querySelector('.project-filters');
  var buttons = Array.from(document.querySelectorAll('[data-project-filter]'));
  var laneElements = Array.from(lanes.querySelectorAll('.feature-lane'));
  var count = document.getElementById('projectCount');
  if (filters) {
    filters.hidden = false;
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var selected = button.dataset.projectFilter;
        if (lanes.dataset.filter === selected) return;
        lanes.dataset.filter = selected;
        buttons.forEach(function (other) { other.setAttribute('aria-pressed', String(other === button)); });
        var visible = 0;
        laneElements.forEach(function (lane) {
          lane.hidden = selected !== 'all' && lane.dataset.projectArea !== selected;
          if (!lane.hidden) visible += lane.querySelectorAll('.feature-card').length;
        });
        count.textContent = String(visible).padStart(2, '0') + ' projects' + (selected === 'all' ? ' / all areas' : ' / ' + button.textContent.trim());
        if (document.documentElement.dataset.motion !== 'reduced' && lanes.animate) {
          lanes.animate([{ opacity: .35, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'cubic-bezier(.22,1,.36,1)' });
        }
      });
    });
  }

  if (typeof HTMLDialogElement === 'undefined') return;
  var dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.setAttribute('aria-labelledby', 'projectTitle');
  dialog.innerHTML = '<div class="project-dialog-top"><span class="project-dialog-index"></span><button type="button" class="dialog-close" aria-label="Close project details">ESC ×</button></div><div class="project-dialog-grid"><div class="project-dialog-art" aria-hidden="true"></div><div class="project-dialog-copy"><p class="project-dialog-scope"></p><h2 id="projectTitle" tabindex="-1"></h2><p class="project-dialog-description"></p><div class="project-dialog-focus"><h3>Inside the project</h3><p></p></div><ul class="project-dialog-tags" aria-label="Technologies"></ul><p class="project-dialog-note" hidden></p><div class="project-dialog-actions"></div></div></div>';
  document.body.appendChild(dialog);
  var title = dialog.querySelector('h2');
  var actions = dialog.querySelector('.project-dialog-actions');
  dialog.querySelector('.dialog-close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (event) {
    if (event.target !== dialog) return;
    var rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  function openProject(key) {
    var project = catalog[key];
    var card = document.querySelector('[data-project="' + key + '"]');
    if (!project || !card || dialog.open) return;
    title.textContent = card.querySelector('h3').textContent;
    dialog.querySelector('.project-dialog-index').textContent = 'PROJECT ' + project.number + ' / ' + project.area.toUpperCase();
    dialog.querySelector('.project-dialog-scope').textContent = project.scope;
    dialog.querySelector('.project-dialog-description').textContent = project.description;
    dialog.querySelector('.project-dialog-focus p').textContent = project.focus;
    var art = card.querySelector('.feature-card-media').cloneNode(true);
    var artImage = art.querySelector('img');
    if (artImage) { artImage.loading = 'eager'; artImage.alt = ''; }
    dialog.querySelector('.project-dialog-art').replaceChildren(art);
    var tags = dialog.querySelector('.project-dialog-tags');
    tags.replaceChildren();
    card.querySelector('.feature-card-meta').textContent.split('·').forEach(function (text) {
      var tag = document.createElement('li'); tag.textContent = text.trim(); tags.appendChild(tag);
    });
    var note = dialog.querySelector('.project-dialog-note');
    note.textContent = project.note || '';
    note.hidden = !project.note;
    var source = card.querySelector('.project-source');
    var primary = source.cloneNode(true);
    primary.className = 'primary-action';
    primary.textContent = source.dataset.actionLabel + ' ↗';
    primary.removeAttribute('data-action-label');
    var back = document.createElement('button');
    back.type = 'button'; back.className = 'project-back'; back.textContent = 'Back to projects';
    back.addEventListener('click', function () { dialog.close(); });
    actions.replaceChildren(primary, back);
    dialog.showModal();
    dialog.scrollTop = 0;
    title.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-project-open]').forEach(function (button) {
    button.hidden = false;
    button.addEventListener('click', function () { openProject(button.dataset.projectOpen); });
  });
  document.addEventListener('portfolio:project', function (event) { openProject(event.detail.key); });
})();
