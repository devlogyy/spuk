I found the remaining risky rendering sources around that area: the top sticky navbar still switches to `glass-strong` with heavy `backdrop-filter` while scrolling, the mobile bottom nav also uses `glass-strong`, and the homepage still has gradient/shadow-heavy feature cards. On mobile Chrome, those layered blur + shadow + gradient effects can create the sound-wave/raster distortion you’re describing, even after removing the card motion.

## Plan

1. **Remove mobile backdrop blur from sticky navigation**
   - Keep the navbar visually close to the current design.
   - On mobile, replace `glass-strong` with a solid/semi-solid `bg-background` + border/shadow.
   - Keep blur only on desktop if needed.

2. **Remove mobile backdrop blur from bottom navigation**
   - Replace the mobile nav’s `glass-strong` pill with a stable `bg-card` surface.
   - Keep the same layout and icons, but remove the blur layer that sits over the affected cards while scrolling.

3. **Redesign the four homepage feature cards to be mobile-raster-safe**
   - Remove gradient icon backgrounds on mobile and use simple solid token surfaces instead.
   - Remove card shadows on mobile and use borders/background contrast for depth.
   - Add `overflow-hidden`, `isolate`, and stable spacing so Scrabble/Crossword cannot visually smear into each other.
   - Keep richer hover/shadow effects only from desktop breakpoints upward.

4. **Reduce remaining mobile glow pressure near the affected section**
   - Remove/limit `shadow-glow` on mobile-only hero search and buttons near the feature cards.
   - Keep the premium look, but avoid stacked compositing effects on small screens.

5. **Verify on a real mobile viewport**
   - Recheck `/` at 390×844.
   - Scroll repeatedly through the Scrabble Solver and Crossword Solver cards.
   - Confirm the cards remain readable, separate, and distortion-free.