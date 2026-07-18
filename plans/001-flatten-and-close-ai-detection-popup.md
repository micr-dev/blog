# 001 - Flatten and close the AI detection popup

- **Status**: DONE
- **Commit**: e17891c
- **Severity**: MEDIUM
- **Category**: Exit motion and interaction clarity
- **Estimated scope**: 2 files, about 80 changed lines

## Problem

The blog AI detection popup currently behaves like a collapsible disclosure. The chevron and native
`details` element minimize the popup instead of dismissing it:

```tsx
// src/components/ai-detection-popup.tsx:97 - current
<details
  className="ai-detection-popup"
  data-verdict={detection.verdict}
  open
>
  <summary className="ai-detection-summary">
    {/* ... */}
    <ChevronRight
      aria-hidden="true"
      className="ai-detection-chevron"
      size={17}
      strokeWidth={1.8}
    />
  </summary>
```

The popup and its icon also use layered shadows, even though the desired treatment is a crisp,
shadowless surface:

```css
/* src/app/globals.css:185 - current */
.ai-detection-popup {
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--post-body) 7%, transparent) inset,
    0 10px 24px color-mix(in srgb, var(--post-background) 72%, transparent),
    0 24px 64px color-mix(in srgb, #000 36%, transparent);
  transition-property: width, box-shadow;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.1);
}

.ai-detection-primary-icon {
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ai-detection-state) 22%, transparent);
}
```

The result breakdown is visually over-carded. Each legend item is boxed, followed by another boxed
AI segments row:

```tsx
// src/components/ai-detection-popup.tsx:169 - current
<div className="ai-detection-legend" data-items={/* ... */}>
  {/* bordered legend cards */}
</div>

<div className="ai-detection-segments">
  <span>AI segments</span>
  <strong>{detection.segments}</strong>
</div>
```

The official [Pangram AI Detector presentation](https://ifdesign.com/en/winner-ranking/project/pangram-ai-detector/765357)
uses one containing surface, horizontal separators, whitespace, and inline legend values. Its main
AI result accent is orange-red rather than a pure red. The current
`oklch(0.69 0.22 35)` AI token is therefore directionally correct and should remain unchanged.

## Target

Render one initially visible, shadowless popup with a real close button. Closing it removes the
popup for the remainder of the current page visit. Do not add a minimized state or reopen affordance.

Use the installed Motion package for an interruptible exit:

```tsx
const EXIT_EASE = [0.23, 1, 0.32, 1] as const;

<AnimatePresence initial={false}>
  {visible ? (
    <motion.aside
      data-verdict={detection.verdict}
      className="ai-detection-popup"
      initial={false}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      exit={reducedMotion
        ? { opacity: 0 }
        : { opacity: 0, transform: "translateY(8px) scale(0.97)" }}
      transition={reducedMotion
        ? { duration: 0.12, ease: EXIT_EASE }
        : { duration: 0.16, ease: EXIT_EASE }}
    >
      {/* content */}
    </motion.aside>
  ) : null}
</AnimatePresence>
```

The popup must not animate on first render. Its close exit lasts 160ms, uses
`cubic-bezier(0.23, 1, 0.32, 1)`, moves down 8px, and scales only to 0.97. With reduced motion,
remove translation and scale while retaining a 120ms opacity-only exit.

Replace the summary disclosure with a static header and an icon-only `X` button:

```tsx
<header className="ai-detection-summary">
  {/* verdict icon, labels, and score */}
  <button
    type="button"
    className="ai-detection-close"
    aria-label="Close content analysis"
    onClick={() => setVisible(false)}
  >
    <X aria-hidden="true" size={17} strokeWidth={1.8} />
  </button>
</header>
```

The close target must be at least 44 by 44 CSS pixels. Its hover state may use a 6% verdict tint,
and its pressed state may scale to 0.96 for tactile feedback. Do not animate the X icon itself.

Flatten the legend into an inline grid with no border, radius, or background on each item. Keep the
icon, percentage, and label. Use whitespace and the existing panel divider as hierarchy. Remove the
AI segments row from rendered markup and delete its CSS selectors. Keep the small model chip because
the official design uses a comparable model label, but do not add any new card or container around it.

Remove all `box-shadow` declarations belonging to the popup and popup icons. Keep the popup's one
pixel border. Keep the existing theme font variables. Keep these verdict colors exactly:

```css
--ai-detection-ai: oklch(0.69 0.22 35);
--ai-detection-assisted: oklch(0.82 0.15 88);
--ai-detection-human: #128d57;
```

## Repo conventions to follow

- Motion is already installed as `motion` version `^12.38.0`; do not add a dependency.
- Import Motion primitives from `motion/react`, as in `src/components/post-progress-rail.tsx:5`.
- Reuse the existing strong ease-out tuple from `src/components/post-progress-rail.tsx:15`:
  `const EASE_OUT = [0.23, 1, 0.32, 1] as const`.
- Follow the existing `AnimatePresence initial={false}` pattern at
  `src/components/post-progress-rail.tsx:179` so first render does not animate.
- Continue using `var(--font-post-body)` in `src/app/globals.css:204`; the popup must inherit each
  blog's theme typography.
- Use the Lucide `X` icon already provided by `lucide-react`; do not draw or download a replacement.

## Steps

1. In `src/components/ai-detection-popup.tsx`, add `"use client"`, import `useState`, import `X`
   instead of `ChevronRight`, and import `AnimatePresence`, `motion`, and `useReducedMotion` from
   `motion/react`.
2. Add local `visible` state initialized to `true`, compute `reducedMotion`, and wrap the popup in
   `AnimatePresence initial={false}`. Render a `motion.aside` only while `visible` is true, using the
   exact exit values in the Target section.
3. Replace `<details>` and `<summary>` with `<motion.aside>` and `<header>`. Replace the chevron with
   a 44 by 44 close button that sets `visible` to false. Preserve the title, score, gauge, verdict
   data attribute, and accessible gauge label.
4. Remove the rendered `.ai-detection-segments` block. Do not change the `AiDetection` type or blog
   frontmatter in this task because the user requested removal from the UI "for now."
5. In `src/app/globals.css`, give `.ai-detection-popup` its open width directly and remove the base
   and `[open]` box shadows, width transition, and `[open]` rule. Remove every popup-specific shadow,
   including the icon outline shadow.
6. Replace disclosure-only CSS (`::-webkit-details-marker`, `::marker`, chevron rotation, and
   `[open]` selectors) with `.ai-detection-close` styles. Make the button 2.75rem square, borderless,
   transparent, circular, pointer-cursored, and centered. Add a 6% state-tinted hover background and
   `transform: scale(0.96)` on `:active`. Limit its transition to background-color and transform at
   150ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
7. Flatten `.ai-detection-legend > span`: remove border, border-radius, and card padding; retain a
   compact grid alignment. Use column and row gaps for two or three visible values, and preserve the
   one-item full-width layout.
8. Delete `.ai-detection-segments` and `.ai-detection-segments strong` CSS. Update the reduced-motion
   rule to disable the close button transition; popup exit reduction is handled by Motion.

## Boundaries

- Do NOT change verdict assignments or percentages in blog frontmatter.
- Do NOT remove `segments` from `src/types/post.ts` or from MDX frontmatter in this task.
- Do NOT add persistence through cookies, local storage, or a global store. Close state lasts only
  for the current mounted page.
- Do NOT add an entrance animation, auto-dismiss timer, minimized state, reopen control, or shadow.
- Do NOT change the gauge geometry or add new informational cards.
- Do NOT touch unrelated shadows elsewhere in `src/app/globals.css`.
- Do NOT add new dependencies.
- If these locations have drifted since commit `e17891c`, stop and report the mismatch instead of
  improvising.

## Verification

- **Mechanical**: run `npm test`, `npm run lint`, and `npm run build`. All must exit with code 0.
- **Rendered desktop check**: start the site on `0.0.0.0`, open one AI, one assisted, and one human
  blog at a 1440px viewport, and confirm:
  - the popup starts fully open;
  - the AI state remains orange-red, assisted remains yellow, and human remains green;
  - the popup and verdict icons have no visible shadow;
  - legend values are flat inline content, not nested cards;
  - no AI segments row appears;
  - the X control closes and unmounts the popup, with no minimized remnant.
- **Rendered mobile check**: at a 390px viewport, confirm the popup fits within 0.75rem side insets,
  the close target is at least 44px, and the legend does not overflow.
- **Feel check**: in browser DevTools, set animation playback to 10%, close the popup, and confirm it
  eases away once with no bounce, moves down exactly 8px, and never shrinks below 97% scale. Repeated
  clicks must not restart or duplicate the exit.
- **Reduced motion check**: emulate `prefers-reduced-motion: reduce`, reload, close the popup, and
  confirm there is no translation or scale and the opacity-only exit completes in 120ms.
- **Done when**: the popup is initially open, shadowless, visually flat inside, dismissible via X,
  absent after dismissal, and all mechanical and rendered checks pass.
