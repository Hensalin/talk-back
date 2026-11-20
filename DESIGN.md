# Talk Back — Design System

The visual language of the Talk Back landing page: a calm, light SaaS look built around one blue, one typeface and soft pastel accents, with product UI rebuilt in code instead of screenshots.

---

## 1. Principles

- **Light and airy.** White page, pale-blue surfaces, thin borders. No dark sections.
- **Show the real product.** Every screen on the page is coded HTML/CSS styled after the Talk Back app, using real features and clearly labelled sample data.
- **One of everything.** One typeface, one primary blue, one radius scale, one easing curve.
- **Motion with purpose.** Animation explains the workflow (assign → draft → review → post). It is never decoration alone, and it switches off for reduced-motion users.

---

## 2. Colour

### Core

| Token | Hex | Use |
|---|---|---|
| `--blue` | `#1458F0` | Primary actions, links, active states, second line of headings |
| `--blue-700` | `#0B40C4` | Button hover, Sign in button |
| `--blue-900` | `#0A2A8A` | Text on pale-blue pills |
| `--blue-50` | `#EFF4FF` | Soft pill backgrounds, hover fills |
| `--blue-100` | `#E3EBFF` | Pill hover |
| `--blue-200` | `#D1E0FF` | Light borders, marquee words |
| `--card` | `#F5F9FF` | Card surface |
| `--ink` | `#171717` | Headings and body |
| `--ink-2` | `#374151` | Secondary text |
| `--grey` | `#4B5563` | Nav links |
| `--mute` | `#6B7280` | Descriptions, captions |
| `--line` / `--line-2` | `#E5E7EB` / `#E6ECF7` | Borders and dividers |

### Accents (from the app)

| Token | Hex | Use |
|---|---|---|
| `--violet` | `#8B5CF6` | Team-member role, drafts |
| `--teal` | `#14B8A6` | Users stat |
| `--amber` | `#F59E0B` | Pending approval |
| `--pink` | `#EC4899` | Notes, approved-this-week stat |
| `--green` | `#16A34A` | Approved, success |
| `--red` | `#C81E1E` | Reject |
| `--yt` | `#EF4444` | YouTube marks |

### Pastel card themes

Each card family gets its own light tint. Use these pairs (outer card → inner scene):

| Theme | Card background | Scene background |
|---|---|---|
| Blue | `#F1F6FF → #FFFFFF` | `#DDE8FF → #EEF3FF` |
| Violet | `#F7F3FF → #FFFFFF` | `#ECE4FF → #F6F1FF` |
| Amber | `#FFF8EC → #FFFFFF` | `#FFF0D6 → #FFF7EA` |
| Red / peach | `#FFF4F4 → #FFFFFF` | `#FFE5E5 → #FFF1EA` |
| Green | `#F0FBF5 → #FFFFFF` | `#DCF7E8 → #EFFBF5` |

Scenes add two soft radial glows in opposite corners and a faint white 40px grid.

### Gradients

- **Brand gradient** (progress lines, active highlights): `#2563EB → #6366F1 → #A855F7`
- **Hero band:** deep blue `#1B32B1`-family gradient with a light grid and a soft beam.

---

## 3. Typography

**Typeface:** Poppins (self-hosted, weights 400 / 500 / 600, `font-display: swap`).

| Style | Size | Weight | Tracking | Notes |
|---|---|---|---|---|
| Hero title | `clamp(40px, 4.45vw, 64px)` | 400 | −3% | Three lines, third line grey and indented |
| Section heading (`.h2`) | `clamp(36px, 4.45vw, 64px)` | 400 | −3% | Line 1 ink, line 2 blue |
| Statement | `clamp(30px, 4vw, 56px)` | 500 | −3.5% | Colours in word by word |
| Card title | `clamp(22px, 2.3vw, 32px)` | 500 | −2% | |
| Body | 16–18px | 400 | 0 | Line height 1.5–1.6 |
| Eyebrow | 14–15px | 400–500 | 0 | Blue, sits above headings |
| UI text (coded app) | 11.5–14px | 400–600 | 0 | |

**Rules**
- Headings are two lines: a dark lead-in and a blue payoff.
- Use `text-wrap: balance` on large centred text.
- Never more than three weights on one screen.

---

## 4. Layout and spacing

| Token | Value |
|---|---|
| Container | `1296px` max |
| Side padding (`--pad`) | `clamp(16px, 4.5vw, 72px)` |
| Section padding | `clamp(80px, 9vw, 150px)` top and bottom |
| Grid gap | 20–28px |

**Breakpoints**

| Width | Behaviour |
|---|---|
| ≥ 1024px | Full desktop: pinned sections, parallax, magnetic buttons |
| 901–1200px | Tighter nav spacing |
| ≤ 1080px | Bento and swimlanes stack, app sidebar collapses to icons |
| ≤ 900px | Mobile menu, 2-column stat tiles |
| ≤ 640px | Single column, app sidebar hidden, tables drop columns |

---

## 5. Shape and depth

**Radius**

| Token | Value | Use |
|---|---|---|
| `--r-xl` | 32px | Hero band, CTA band |
| `--r-lg` | 24px | Cards, panels |
| `--r-md` | 16px | Inner scenes, app windows |
| `--r-sm` | 12px | Inputs, icon tiles |
| Pill | 100px | Buttons, chips, tags |

**Shadows** — soft and blue-tinted, never black:

- Default: `0 1px 2px rgba(16,24,40,.04), 0 12px 32px -12px rgba(16,24,40,.14)`
- Floating UI: `0 30px 60px -30px rgba(16,40,120,.45)`
- Borders are drawn as `inset 0 0 0 1px` shadows so they never shift layout.
- "How it works" sits flat on the page with no outer shadow.

---

## 6. Components

### Navigation
- Logo left, links centred with no background box, actions right.
- Active link: blue text with a small dot.
- **Sign up:** outlined pill (`1.5px #C9D8FB` border, blue text).
- **Sign in:** solid blue pill with a round arrow badge.
- Mobile: hamburger opens a full menu with both buttons.

### Buttons (pills)
| Variant | Look |
|---|---|
| `pill--blue` | Solid blue, white text, arrow badge |
| `pill--soft` | Pale blue, dark-blue text, blue arrow badge |
| `pill--white` | White on blue backgrounds |
| `pill--outline` | Transparent with white border, for blue backgrounds |

Arrow badges rotate on hover. On desktop, pills pull gently toward the cursor.

### Coded app window
Browser chrome (three dots, address bar) → sidebar → top bar → content. Used in the hero dashboard and as small "talkback.app" cards in How it works.

### Cards
- **Feature cards:** text + coded UI scene. Layout: one full-width card, two side by side, one full-width card. Each has its own pastel theme.
- **Benefit cards:** sticky stack; earlier cards shrink and dim as the next arrives.
- **"…and more" tiles:** icon tile + title + one line, rows of 3 + 2.
- **FAQ rows:** rounded, white, with a blue plus that turns into a minus.

### Chips and tags
Small pills for status: Assigned (blue), Pending (amber), Approved (green), Draft (violet), Note (pink), Comment (grey).

### Workflow arc (How it works)
- Five white step circles on a semicircle, numbered badges.
- Active step: white circle with blue ring, pulse and spinning gradient ring.
- Done steps: blue icon, blue number badge.
- Progress line uses the brand gradient; a light streak sweeps the arc.
- Step tabs underneath; active tab is solid blue with a shine.

### Roles swimlanes
- App-window frame titled "Talk Back · who does what".
- Two lanes: Admin (blue tint) and Team member (violet tint).
- Square step tiles; connectors are dashed blue (hand-off), green (approved), dashed red (rejected), with dots travelling along them.
- A highlight walks through the steps in order.

---

## 7. Backgrounds

- **Grid:** faint blue lines (`rgba(20,88,240,.05–.09)`), 32–64px squares, masked to fade at the edges.
- **Glows:** large blurred radial blobs in blue, violet or cyan, kept under 30% opacity.
- **Giant words:** oversized pale text behind sections ("MORE / INSIDE", "COMMENTS / REPLIES") that slides with scroll.
- **Section tints:** grid, violet wash, dots, pale blue — alternated so neighbouring sections differ.

---

## 8. Motion

**Libraries:** GSAP + ScrollTrigger for animation, Lenis for smooth scrolling (all bundled locally).

**Easing:** `cubic-bezier(.22, .8, .24, 1)` for CSS; `expo.out` / `power3.out` in GSAP.

| Type | Behaviour | Examples |
|---|---|---|
| Once | Plays when a section reaches ~85% of the viewport | Headings, cards, FAQ, roles |
| Scrub | Follows scroll position both ways | Hero tilt, giant words, parallax |
| Pin | Section holds while scroll drives it | Statement, How it works (5 steps over ~3 screens) |
| Loop | Runs continuously | Band marquee, comment stream, pulses, floating chips |
| Pointer | Follows the mouse | Card tilt, spotlight, magnetic buttons |

**Durations:** 0.5–0.9s for UI, 1–1.4s for large entrances. Stagger 0.04–0.12s.

**Rules**
- Animate `transform` and `opacity` only. Hover lifts use the `translate` property so they never clash with GSAP.
- No 3D flips or dark flashes; prefer fade + rise.
- Smooth scrolling pauses while ScrollTrigger re-measures (prevents pinned sections drifting after a resize).
- Pinning and pointer effects are desktop-only (≥ 1024px).
- `prefers-reduced-motion: reduce` disables all motion; with JavaScript off, every section is still readable.

---

## 9. Page structure

1. Navigation
2. Hero — headline, dashboard, scrolling "ASSIGN DRAFT REVIEW POST" band
3. How it works — pinned five-step arc
4. Comment stream — tilted card marquee
5. Features — 4 feature cards
6. "…and more" — 5 secondary features
7. Benefits — sticky stacked cards
8. Roles — Admin / Team member swimlanes
9. Audience
10. Statement — "Simple teamwork"
11. FAQ
12. Call to action
13. Footer

---

## 10. Accessibility

- Text contrast meets WCAG AA on all surfaces.
- Visible focus rings (blue, white on blue backgrounds).
- Skip link to main content.
- Decorative UI and motion layers are `aria-hidden`; the coded dashboard has a descriptive label.
- Every interactive step (arc nodes, tabs) is a real `<button>`.

---

## 11. Assets

| File | Purpose |
|---|---|
| `assets/fonts/poppins-*.woff2` | Typeface (SIL OFL) |
| `assets/images/favicon.svg`, `favicon-32.png` | Browser icon |
| `assets/images/apple-touch-icon.png`, `icon-192.png`, `icon-512.png` | App icons |
| `assets/images/og-image.png` | 1200×630 social share image |

