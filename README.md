# lore.mascia

Personal portfolio for **Lorenzo Mascia** — Product Developer focused on AI/ML systems, software products and connected hardware.

A portfolio with a terminal-style homepage, tabbed experience, a featured-projects
grid, a dedicated Indoor Tracking System case study, and a canvas-based **SYSTEM MODE**
knowledge graph.

## Files

| Path | Description |
| --- | --- |
| [`index.html`](index.html) | The standalone, self-contained implementation — open it directly in a browser. |
| [`indoor-tracking.html`](indoor-tracking.html) | Long-form Indoor Tracking System hardware case study. |
| [`assets/`](assets/) | Photographs, prototype images and sketches from the Indoor Tracking System bachelor's thesis. |
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

`index.html` ports the Claude Design Compiler component to vanilla JS — no runtime,
no dependencies. Behaviors reproduced 1:1 from the design:

- **Typed terminal** in the hero
- **Scroll reveal** via `IntersectionObserver`
- **Magnet buttons** that lean toward the cursor
- **`style-hover`** shim (inline hover styles applied on `mouseenter`/`mouseleave`)
- **Experience tabs** switching role / meta / bullets
- **Hardware case study** — one homepage card linking to a dedicated page with system, transmitter and receiver details
- **SYSTEM MODE** — an animated, mouse-reactive node graph on `<canvas>` (`Esc` to exit)

Theme accent is driven by the `--accent` / `--accent-text` CSS variables.

## Content policy

- Public projects link to their specific repository or article.
- Professional Ericsson work is described at a high level; internal names, code and architecture remain confidential.
- Unverified benchmarks and hardware measurements are intentionally omitted.
- The portfolio is the long-form source of truth; a shorter résumé will be produced from its strongest evidence later.
