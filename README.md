# lore.mascia

Personal portfolio for **Lorenzo Mascia** — AI Engineer & Product Developer.

A single-page site with a terminal-style hero, tabbed experience, a featured-projects
grid, an interactive hardware carousel with hover-to-inspect component pins, and a
canvas-based **SYSTEM MODE** knowledge graph.

## Files

| Path | Description |
| --- | --- |
| [`index.html`](index.html) | The standalone, self-contained implementation — open it directly in a browser. |
| [`assets/`](assets/) | Placeholder SVGs for the hardware photos and sketches. Swap these for real images. |
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
- **Hardware carousel** — 3 slides, prev/next + click-to-focus, with hover-to-inspect pins
- **SYSTEM MODE** — an animated, mouse-reactive node graph on `<canvas>` (`Esc` to exit)

Theme accent is driven by the `--accent` / `--accent-text` CSS variables.

## To personalize

Search `index.html` for `[edit]` markers and replace the placeholder copy, then drop
real photos into `assets/` (update the `<img src>` extensions if you use `.png`/`.jpg`).
