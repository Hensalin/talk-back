# QA report (v2)

Tested 21 Oct 2026 in headless Chromium (Playwright) against a local server. ✅ = actually run.

## Layout

| Check | Result |
|---|---|
| Rendered at 360, 390, 430, 820, 1366, 1440, 1920 px wide | ✅ Reviewed screenshots at 390 and 1440 |
| Horizontal overflow at all sizes | ✅ None (after fixes below) |
| Console errors / failed requests | ✅ None |
| Anchors resolve; only external link is the sign-in page | ✅ |
| One H1, one H2 per section | ✅ |

## Interaction

| Check | Result |
|---|---|
| Mobile menu: opens, Escape closes, link closes and scrolls to section | ✅ |
| FAQ: click open/close animated, Enter key opens | ✅ |
| How it works: each of 5 steps activates its matching coded screen (desktop); each step shows its own screen inline (mobile) | ✅ |
| Hero counters reach 12 / 4 / 3 / 9 | ✅ |
| Assignment demo ends at "Ana M. · Assigned", Unassigned 0 | ✅ |
| Draft typing completes the full sentence | ✅ |
| Stacked benefit cards: earlier card scales/dims behind the next, no see-through | ✅ (screenshot checked) |

## Fallbacks

| Check | Result |
|---|---|
| JS disabled: headline visible, first workflow screen visible, draft text present | ✅ |
| Reduced motion: no ScrollTriggers, marquee stopped, all text present | ✅ |
| No text left hidden after scrolling the page at any size | ✅ |

## Fixed during testing

1. GSAP warnings from empty target lists in the Users card. Now guarded.
2. 360px phones: nav and stacked cards overflowed by ~40px (grid children not shrinking, sign-in pill too wide). Fixed.
3. Stacked cards became see-through as they dimmed. Now only their content dims.
4. Mobile workflow showed one screen far above the active step. Screens now sit inside each step on mobile.
5. CTA toast covered the sign-in button. Moved.

## Not verified

- Safari/iOS, Firefox and real phones (only headless Chromium).
- Screen reader pass and measured colour contrast.
- Lighthouse scores. Page weight is about 300 KB.


## v3 re-test (21 Oct 2026, headless Chromium)

- 360 to 1920px: no page-level horizontal overflow, no console errors, no failed requests, no text left hidden after scrolling.
- Lenis is active. Anchor links scroll smoothly and land 90px below the top, under the nav.
- The loader removes itself. Hero characters end fully visible. Counters reach 12/4/3/9.
- Pinned workflow: halfway shows 03/05, the end shows 05/05, and the track moves the full distance.
- Mobile menu (open, Escape, link) and the FAQ open/close both pass.
- With JS off: no loader, workflow shown as a vertical list, no overflow.
- Reduced motion: no loader, no Lenis, no ScrollTriggers, vertical workflow.
- **Fixed:** the hero headline broke words mid-word on phones after splitting into characters. It now splits per word.
- **Fixed:** the assign menu overlay was clipped. It has been moved.
- **Still not verified:** Safari/iOS, Firefox, real devices (Lenis feel on trackpads and phones), and screen readers.

## v4 re-test (21 Oct 2026, headless Chromium)

- 360 to 1920px: no page-level overflow, no console errors or warnings, no failed requests, no text left hidden.
- The statement pin works at 1440px. At the end of the pin, all 8 cards are in place and the sentence is fully blue.
- The workflow pin still works: halfway shows 03/05, the end shows 05/05.
- The menu, FAQ, anchors, no-JS mode and reduced motion all pass.
- **Fixed:** hub feature cards froze at their start position because a CSS transform transition fought GSAP. GSAP now owns `transform`, and hover lifts use the separate `translate` property.

## v5 re-test (21 Oct 2026, headless Chromium)

- 360 to 1920px: no page-level overflow, no console errors or warnings, no failed requests, no text left hidden.
- Arc workflow at 1440×900: 2% of the pin shows step 1, 50% shows step 3, 95% shows step 5. Clicking node 4 goes to "Review drafts".
- The menu, FAQ, anchors, counters, no-JS mode and reduced motion all pass.
- Phone layout of the workflow (stacked dark cards) checked visually at 390px.

## v6 re-test (21 Oct 2026, headless Chromium)

- 360 to 1920px: no overflow, no console errors or warnings, no failed requests, no hidden text.
- The arc workflow, menu, FAQ, anchors, counters, no-JS mode and reduced motion all pass.

## v7 re-test (21 Oct 2026, headless Chromium)

- 360 to 1920px: no overflow, no console errors or warnings, no hidden text.
- The arc fits on screen at 1366×768, 1440×900 and 1920×1080 (tab row inside the viewport).
- Steps advance in order. Clicking a node or tab jumps to that step.
- The menu, FAQ, no-JS mode and reduced motion all pass.
