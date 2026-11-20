# Talk Back — SEO, AEO & GEO setup

What was added so search engines (Google, Bing), answer engines (featured snippets, People Also Ask, voice) and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews) can understand and cite the page.

## 1. Before you go live (required)

The live address is assumed to be **https://talkback.bckofiz.com/**. If the landing page lives anywhere else, find-and-replace that address in:

- `index.html` (canonical, Open Graph, Twitter and JSON-LD)
- `robots.txt` (Sitemap line)
- `sitemap.xml`
- `llms.txt`

Social-share images must be absolute URLs on the live domain, so this step matters.

## 2. Files added or changed

| File | Purpose |
|---|---|
| `index.html` `<head>` | Keyword-led title, 155-character description, canonical, robots directives, Open Graph and Twitter cards, icons, manifest |
| `index.html` JSON-LD | Organization, WebSite, WebPage, SoftwareApplication (with feature list), HowTo (the 5 workflow steps) and FAQPage (all 8 FAQ answers) |
| `index.html` FAQ | Two new answer-first questions: "What is Talk Back?" and "Who is Talk Back for?" (AEO: direct definitions that AI and snippets quote) |
| `robots.txt` | Allows all crawlers, explicitly allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) and points to the sitemap |
| `sitemap.xml` | Lists the page and its share image |
| `llms.txt` | Plain-language summary for AI assistants (GEO) |
| `site.webmanifest` | App name, colours and icons |
| `assets/images/og-image.png` | 1200×630 social share image |
| `assets/images/icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, `favicon-32.png` | Icons for Google results, iOS, Android and browsers |

## 3. After launch (do these once)

1. **Google Search Console**: add the site, verify it and submit `sitemap.xml`.
2. **Bing Webmaster Tools**: import from Search Console. This also feeds ChatGPT search and Copilot.
3. **Rich Results Test** (search.google.com/test/rich-results): paste the live URL and confirm FAQ and SoftwareApplication are detected.
4. **Share preview**: paste the URL into LinkedIn Post Inspector and the X/Twitter composer to check the card.
5. **PageSpeed Insights**: check Core Web Vitals on mobile.

## 4. What actually moves rankings (ongoing)

No file can guarantee position #1. Rankings come from relevance, links and trust over time. The highest-impact next steps:

- **Content depth**: add pages that answer real searches, for example "how to manage YouTube comments as a team", "YouTube comment approval workflow", "how to let staff reply to YouTube comments without channel access", and comparisons with other tools.
- **Backlinks and mentions**: product directories (Product Hunt, G2, Capterra, SaaSHub), creator and agency blogs, partner sites. AI assistants also lean heavily on third-party mentions.
- **Brand consistency**: use the same name and description of Talk Back everywhere (website, LinkedIn, directories) so AI systems connect them.
- **Fresh dates**: update `<lastmod>` in `sitemap.xml` whenever the page changes.
- **Legal and trust pages**: a privacy policy, terms and a contact or about page help both users and search trust signals. They don't exist yet.
