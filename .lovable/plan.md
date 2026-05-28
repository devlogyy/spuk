# Fix: mobile distortion on Scrabble/Crossword cards

## Root cause
On Android Chrome, the feature cards in `src/pages/Home.tsx` stack three GPU-layer triggers on top of each other:

- `motion.div` with `initial={{opacity:0, y:16}} whileInView={...}` — promotes a compositor layer per card
- Tailwind's bare `transition` class — animates `all` properties including the inner gradient icon, keeping the layer "dirty"
- `hover:-translate-y-1` + `shadow-glow` — re-promotes the layer when the user scrolls/touches

Combined with the long page below (blur-3xl mesh orbs in Word-of-the-day and CTA sections), this is enough to trip the known Chrome mobile rasterizer bug that paints rainbow static where the card body should be. It always lands on the 2nd/3rd card because that's where the viewport sits when the in-view animation fires.

## What to change

Only `src/pages/Home.tsx`, feature-cards section (around lines 123–140):

1. Replace `transition` with `transition-transform duration-200` on the `Link` so only `transform` (a cheap, layer-safe property) animates — not `background`, `box-shadow`, or `color`.
2. Drop `whileInView` transforms on these specific cards and use a simple `initial={{opacity:0}} whileInView={{opacity:1}}` (no `y`). Opacity-only animation does not require a transform layer.
3. Add `transform-gpu` + `will-change-auto` (instead of implicit `will-change: transform`) so the browser releases the layer once the fade is done.
4. Add `backface-visibility: hidden` via a `[transform:translateZ(0)]` wrapper only if step 1–3 isn't enough — kept as a fallback, not the primary fix.

No design changes: cards still fade in, still lift on hover, still keep the gradient icon and shadow. Just no more rainbow band.

## Verification
- Reload `/` on mobile viewport (390×844), scroll slowly past the four feature cards multiple times, confirm the distortion is gone.
- Confirm hover lift + shadow still work on desktop.

## Files
- `src/pages/Home.tsx` (one section, ~15 lines touched)

No other files, no new deps, no backend, no credits.
