# Talk Back — landing page

Standalone HTML/CSS/JS site. No build step and no external requests: Poppins, GSAP + ScrollTrigger and Lenis (smooth scrolling) are bundled.

## Run locally

```bash
cd talk-back-landing-page
python3 -m http.server 8000
# open http://localhost:8000
```

(`npx serve .` works too.)

## Structure

```
index.html                     page markup, incl. all coded dashboard UI and the SVG icon sprite
css/style.css                  design tokens, layout, coded app UI, responsive rules
js/script.js                   menu, nav, workflow steps, FAQ, GSAP animations
js/vendor/                     GSAP 3.12.5 + ScrollTrigger, Lenis 1.3.27 (from npm, MIT licence included)
assets/fonts/                  Poppins 400/500/600 (SIL OFL, licence included)
assets/images/favicon.svg
DESIGN.md (design system), QA-REPORT.md, SEO-GUIDE.md
```

## Before publishing

- **CTAs** all point to `https://talkback.bckofiz.com/login`. There is no demo/contact address in the project, so none was invented. Add one by editing those links in `index.html`.
- **Dashboard data** in the coded UI is sample data (Priya S., Daniel R., Ana M., video titles, counts). It's labelled as such under the hero. Change the names/numbers in `index.html` if you want different examples.
- **Legal pages** don't exist in the project, so the footer doesn't link to any.
