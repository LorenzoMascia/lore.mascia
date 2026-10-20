# lore.mascia

Personal portfolio for **Lorenzo Mascia** — Product Developer focused on AI/ML systems, software products and connected hardware.

A portfolio with an interactive orbital homepage, tabbed experience, a featured-projects
grid, a dedicated Indoor Tracking System case study, and a canvas-based **SYSTEM MODE**
knowledge graph. The refreshed design pairs paper tones and cyan accents with restrained motion.

## Files

| Path | Description |
| --- | --- |
| [`index.html`](index.html) | Portfolio homepage — open it directly in a browser. |
| [`indoor-tracking.html`](indoor-tracking.html) | Long-form Indoor Tracking System hardware case study. |
| [`assets/portfolio.js`](assets/portfolio.js) | Terminal, experience tabs, section navigation and System Mode. |
| [`assets/refresh.css`](assets/refresh.css) | Shared responsive design, orbital illustration and motion styles. |
| [`assets/refresh.js`](assets/refresh.js) | Quick navigation, mobile menu, motion preference, reading progress and image viewer. |
| [`assets/project-explorer.js`](assets/project-explorer.js) | Project filters and accessible project overviews, using existing portfolio content. |
| [`assets/explorer.css`](assets/explorer.css) | Project cards and dialogs, contact tools and case-study section navigation. |
| [`assets/`](assets/) | Project artwork, CV, prototype photographs and original thesis sketches. |
| [`Portfolio.dc.html`](Portfolio.dc.html) | The original Claude Design source this site was built from. |

## Run locally

It's a static site with no build step:

```bash
# just open it
start index.html          # Windows
# or serve it
python -m http.server 8000
```

## Implementation notes

Buildless HTML, CSS and vanilla JavaScript, with no framework or runtime dependencies.
The original design source is retained in `Portfolio.dc.html`.

- **Interactive orbital diagram** with selectable hardware, software, AI and product domains
- **Project explorer** with filters for AI systems, product engines and applied operations; six detailed overviews with repository or contact actions
- **Typed terminal**, scroll reveals and an animated career timeline
- **Quick navigation** with `Ctrl+K` / `⌘K`, search, arrow-key selection and direct access to individual project overviews
- **Mobile navigation**, active-section indicators and reading progress
- **Magnet buttons** that lean toward the cursor
- **`style-hover`** shim (inline hover styles applied on `mouseenter`/`mouseleave`)
- **Experience tabs** with keyboard navigation and accessible panel relationships
- **Hardware case study** with a sticky section outline and a photo/sketch gallery; use the arrow keys or previous/next buttons, and Home/End for the first/last image
- **Copy email** with accessible feedback and an email-selection fallback when clipboard access is unavailable
- **SYSTEM MODE** — an animated node graph with keyboard/touch destinations, focus containment and `Esc` to exit
- **Motion control** in the footer; respects `prefers-reduced-motion` and saves an explicit preference locally

The orbital animation pauses offscreen; the graph stops when its dialog closes or the browser tab is hidden.
Reduced-motion mode keeps the graph static and disables animated scrolling and decorative movement.
Photographs and project previews load lazily. Local QA screenshots and browser profiles belong in the ignored `.preview/` directory.

Project cards and repository/contact links remain available without JavaScript. Filtering and detail dialogs are progressive enhancements. Hidden legacy project grids have been removed; longer project descriptions now live in `assets/project-explorer.js`.

Theme accent is driven by the `--accent` / `--accent-text` CSS variables.

## Content policy

- Public projects link to their specific repository or article.
- Professional Ericsson work is described at a high level; internal names, code and architecture remain confidential.
- Unverified benchmarks and hardware measurements are intentionally omitted.
- The portfolio is the long-form source of truth; a shorter résumé will be produced from its strongest evidence later.
