I’ll fix the mobile distortion at the root by making the homepage feature cards static, isolated, and compositor-safe.

## Plan

1. **Remove Framer Motion from the four top feature cards**
   - Replace the `motion.div` wrappers around Scrabble, Crossword, Word Finder, and AI Move Engine with normal static wrappers.
   - This removes the scroll-triggered in-view animation that can create the repeated “mirror/card duplication” effect on mobile Chrome.

2. **Make each feature card layout stable on mobile**
   - Give the card content a stable minimum height so Scrabble/Crossword/Word Finder cards don’t visually compress or overlap during scroll.
   - Keep the same look: rounded cards, icon, title, description, and “Open tool”.

3. **Remove GPU-heavy effects from this specific section on touch/mobile**
   - Remove hover translate/shadow behavior from the mobile version of these cards.
   - Keep desktop hover lift if safe, but no scroll-based card motion on mobile.

4. **Reduce blur/backdrop pressure near the affected area**
   - Replace the small `backdrop-blur` badge in the hero with a solid translucent background, because mobile blur over gradients can worsen raster/compositor glitches.
   - Leave the visual design almost identical.

5. **Verify on mobile viewport**
   - Recheck `/` at 390×844 and scroll repeatedly through the Scrabble/Crossword cards.
   - Confirm the duplicate/mirror effect and stretched text are gone.