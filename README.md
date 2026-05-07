# Invoiso — Landing Page

This folder contains the static landing page for **Invoiso**, hosted on GitHub Pages at:
**https://invoiso.co.in/**

---

## File Structure

```
landing/
├── 404.html                     # Custom not-found page
├── CNAME                        # Custom domain for GitHub Pages
├── README.md                    # Landing page maintenance notes
├── changelog.html               # Release notes / updates page
├── download.html                # Download page with GitHub release assets
├── faq.html                     # Standalone FAQ page
├── google248713aeb50035cd.html  # Google Search Console verification
├── index.html                   # Main landing page
├── install.sh                   # Linux quick-install script
├── invoice-maker.html           # Browser invoice maker tool
├── llms.txt                     # LLM crawler context file
├── package.json                 # Tailwind build scripts
├── package-lock.json            # Locked npm dependencies
├── robots.txt                   # Crawler instructions
├── sitemap.xml                  # XML sitemap submitted to Google Search Console
├── style.css                    # Main landing page styles
├── styles-invoice-maker.css     # Invoice maker page styles
├── tailwind-input.css           # Tailwind source CSS
├── tailwind.config.js           # Tailwind configuration
├── tailwind.css                 # Generated Tailwind output
├── .gitignore                   # Landing repo ignore rules
├── .nojekyll                    # Serves files as-is on GitHub Pages
└── assets/
    ├── js/
    │   └── app.js               # Shared landing page JavaScript
    └── images/
        ├── logo.svg             # Main app logo
        ├── logo1.svg            # Alternate logo asset
        ├── invoiso_banner.png   # Banner image
        ├── invoiso_banner.webp  # Open Graph / hero banner image
        ├── pngs/                # Product graphics and PNG exports
        ├── screenshots/         # Original app screenshots
        └── screenshots2/        # Optimized WebP screenshots
```

---

## Pages

| File | URL | Purpose |
|------|-----|---------|
| `index.html` | `/` | Main landing page — hero, features, how it works, comparison, FAQ teaser, testimonials |
| `faq.html` | `/faq.html` | Full FAQ page organised by category |
| `download.html` | `/download.html` | Download links for Windows, Linux, and macOS |
| `changelog.html` | `/changelog.html` | Product updates and release notes |
| `invoice-maker.html` | `/invoice-maker.html` | Online invoice maker tool |
| `404.html` | fallback | Custom not-found page |
| `install.sh` | `/install.sh` | Linux quick-install script used by the download page |

---

## Linux Quick Install

The download page shows two terminal install options. Keep this README and the visible commands in `download.html` in sync when the install script changes.

### DEB package

Use this for Ubuntu 22.04 or 24.04:

```bash
curl -fsSL https://invoiso.co.in/install.sh | bash -s -- --deb
```

### AppImage

Use this for other Linux distributions or when a portable app is preferred:

```bash
curl -fsSL https://invoiso.co.in/install.sh | bash -s -- --appimage
```

The script fetches the latest GitHub release from `Anooppandikashala/invoiso`, selects the matching asset name, downloads it to `/tmp`, and either installs the DEB with `apt-get` or moves the AppImage to `~/Applications`.

---

## How to Edit Content

### Update the app version
In `index.html`, search for `softwareVersion` in the `<script type="application/ld+json">` block and update the value.

### Add or remove a feature
In `index.html`, find the `<!-- Features Section -->` and add/remove `<div class="feature-item">` blocks.

### Add a testimonial / review
In `index.html`, find the `testimonials` array near the bottom of the `<script>` block:

```js
var testimonials = [
  /* Uncomment after client approval:
  {
    name: 'Keyson',
    location: 'Jamaica',
    text: 'Your review text here...',
    stars: 5,
  },
  */
];
```

- **To add a review:** add a new object inside the array (remove the comment wrappers).
- **To hide all reviews:** leave the array empty — the entire section hides itself automatically.
- **stars** accepts values 1–5.

### Add a FAQ question
**For the full FAQ page** — open `faq.html` and add a new `<details class="faq-item">` block inside the appropriate category section:

```html
<details class="faq-item">
  <summary class="faq-question">
    Your question here?
    <i class="fas fa-chevron-down faq-chevron" aria-hidden="true"></i>
  </summary>
  <div class="faq-answer">
    <p>Your answer here.</p>
  </div>
</details>
```

Also add the same question to the `FAQPage` JSON-LD structured data block in the `<head>` of `faq.html` so Google picks it up as a rich result.

**For the teaser on the home page** — add a block inside `<!-- FAQ Teaser Section -->` in `index.html` (keep it to 4–6 questions max).

### Add a screenshot
1. Export the screenshot as `.webp` and place it in `assets/images/screenshots/`
2. In `index.html`, find the `screenshots` array inside the `<script>` block and add an entry:

```js
{ src: 'your-file.webp', text: 'Caption shown below slide', alt: 'Descriptive alt text for SEO', category: 'Invoices' },
```

Available categories: `Invoices` · `PDF` · `Clients` · `Products` · `Settings`

### Update sitemap dates
After any content change, update the `<lastmod>` date in `sitemap.xml` for the affected page(s):

```xml
<lastmod>2026-03-11</lastmod>  <!-- change to today's date -->
```

Then re-submit the sitemap in Google Search Console.

---

## Design Tokens

All colours and spacing are defined as CSS variables in `style.css`:

```css
:root {
  --bg:           #06080f;   /* page background */
  --surface:      #0d1526;   /* card / section background */
  --primary:      #4f8ef7;   /* blue accent — buttons, headings */
  --accent:       #8b5cf6;   /* purple secondary accent */
  --text:         #e2e8f0;   /* primary text */
  --text-muted:   #64748b;   /* secondary / caption text */
  --border:       rgba(255,255,255,0.08);  /* subtle borders */
}
```

Change `--primary` to rebrand the entire page colour scheme.

---

## SEO

| Element | Location | Notes |
|---------|----------|-------|
| Page title | `<title>` in `<head>` | Keep under 60 characters |
| Meta description | `<meta name="description">` | Keep under 155 characters |
| Structured data | `<script type="application/ld+json">` | `SoftwareApplication`, `FAQPage`, `WebSite` schemas |
| Open Graph image | `og:image` | Must be 1200×630px — file: `assets/images/invoiso-banner.webp` |
| Sitemap | `sitemap.xml` | Submit to Google Search Console after any URL changes |
| Robots | `robots.txt` | Currently allows all crawlers |
| No-Jekyll | `.nojekyll` | Required — without it GitHub Pages silently blocks `sitemap.xml` |

---

## Deployment

The landing page is deployed automatically via **GitHub Pages** whenever changes are pushed to the configured branch.

1. Make your changes to the files in this folder
2. Commit and push to the repository
3. GitHub Pages rebuilds in ~1–2 minutes
4. Verify changes live at `https://invoiso.co.in/`

> **Do not delete `.nojekyll`** — removing it causes GitHub Pages to run Jekyll which breaks `sitemap.xml` and `robots.txt`.

---

## External Dependencies (CDN)

| Library | Version | Used for |
|---------|---------|----------|
| [Tailwind CSS](https://tailwindcss.com) | 2.2.19 | Utility CSS classes |
| [Font Awesome](https://fontawesome.com) | 6.4.0 | Icons |
| [Swiper.js](https://swiperjs.com) | 10 | Screenshots carousel |
| [Inter](https://fonts.google.com/specimen/Inter) | — | Body font (Google Fonts) |

---

## Analytics

Google Analytics 4 is integrated via `gtag.js` with tracking ID `G-D7RSN6EGR6`.
View traffic data at [Google Analytics](https://analytics.google.com) and search performance at [Google Search Console](https://search.google.com/search-console).
