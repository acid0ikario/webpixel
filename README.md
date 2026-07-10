# Handoff: Pixels Agency Website

## Overview
Marketing website for **pixels.** (padsv.com) — a publicity agency + software development studio based in El Salvador with clients from USA to Panama. Single-page responsive site (mobile + desktop) with sections: Hero, About (Nosotros), Services, Portfolio, Plans/Pricing, FAQ, CTA, Footer. Bilingual (Spanish default, English toggle). Intended hosting: AWS S3 + CloudFront (static site).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, NOT production code to copy directly. Your task is to **recreate this design in your target stack** (e.g. Astro, Next.js static export, plain HTML/CSS/JS — anything that builds to static files for S3/CloudFront) using that stack's established patterns. `Pixels Website.dc.html` uses a proprietary design-component runtime (`support.js`) that will not run outside its original environment — treat it as a spec, not a dependency.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final. Recreate pixel-perfectly.

## Screens / Views

### 1. Navigation (fixed top bar)
- Fixed, full-width, z-index above all content. Height 68px, content max-width 1200px centered, horizontal padding clamp(16px, 4vw, 32px).
- Background: rgba(23,8,36,0.78) with `backdrop-filter: blur(14px)`; bottom border 1px rgba(255,255,255,0.07).
- Logo: "pixels" in Sora 800 24px with gradient text (90deg, #4AA3DF → #E0218A) + a magenta "." (#E0218A).
- Desktop (>900px): center links Nosotros / Servicios / Portafolio / Planes / FAQ — Manrope 600 15px, color #CBB8DE, hover #FFFFFF. Right side: language pill button ("EN"/"ES", 1px border rgba(255,255,255,0.25), radius 999px, 8px 14px padding, hover border #E0218A) + CTA button "Empezar" (gradient 90deg #4AA3DF→#E0218A, radius 999px, 10px 22px, Sora 700 14px, hover: translateY(-2px) + shadow 0 10px 26px rgba(224,33,138,0.35)).
- Mobile (≤900px): links collapse into hamburger (three bars: two 22px white, one 14px magenta) opening a full-screen overlay menu — background rgba(23,8,36,0.97), links in Sora 700 30px, close button 44px circle. Anchor links close the menu.

### 2. Hero (three variants — pick via `heroVariant` prop; "centered" is default)
Shared: background #170824 with two animated blurred radial blobs (520–560px circles, blue rgba(74,163,223,0.45) top-left, magenta rgba(224,33,138,0.4) bottom-right, blur 70–80px, 16–20s ease-in-out float loops) + one thin decorative circle outline. Badge pill: "Publicidad + Desarrollo de software" — 13px 700 uppercase, letter-spacing 0.12em, color #F08BC0, border 1px rgba(224,33,138,0.4), bg rgba(224,33,138,0.08).
- **A — Centered** (default): everything centered, max-width 1000px. H1 Sora 800, clamp(38px, 7vw, 76px), line-height 1.08: "Creamos ideas que generan GRANDES negocios" with "GRANDES" in gradient text. Sub-copy Manrope, clamp(16px,2vw,19px), #CBB8DE, max-width 640px. Two CTAs: primary gradient pill "¿Cuándo empezamos?" + secondary outlined pill "Ver servicios" (16px 34px padding, Sora 700 16px).
- **B — Split**: two-column grid (auto-fit minmax 420px), text left / visual right. Visual: 4:5 image slot in a 28px-radius card with 2px gradient border, plus two floating glass chips ("Campañas 360º", "Clientes de USA a Panamá") — bg rgba(23,8,36,0.9), blur 8px, radius 14px.
- **C — Bold typographic**: stacked uppercase lines at clamp(48px,10vw,120px): "Ideas" (outline text, 2px stroke rgba(244,239,249,0.7)), "que generan" (solid, 0.42em), "Grandes" (gradient), "Negocios." (outline).

### 3. Nosotros / About — bg #1D0B2E
- Section label: 13px 700 uppercase, letter-spacing 0.18em, #E0218A. H2: Sora 700 clamp(28px,4vw,44px) "Tu aliado estratégico a largo plazo".
- Misión/Visión: 2-up grid (minmax 300px), 24px-radius cards, 32px padding. Misión card has 1px gradient border (padding-box/border-box technique) over #26103D; Visión card is rgba(255,255,255,0.04) + border rgba(255,255,255,0.09). Card titles Sora 700 20px in #F08BC0 (Misión) / #7FBCE8 (Visión).
- Four pillar cards (TeamWork, Portafolio integral, Innovación, Regionalización): grid minmax 230px, 20px radius, 26px padding, bg rgba(255,255,255,0.03), title Sora 700 17px, body 14.5px #B9A8CC.

### 4. Servicios — bg #170824
Six cards in grid (minmax 280px, gap 20px): Social Media, Campañas 360º, Webinars, Chatbot IA, Impresión y DOOH, Desarrollo de software. Card: 22px radius, 30px padding, bg rgba(255,255,255,0.04), border rgba(255,255,255,0.09); gradient-text index number ("01"…); title Sora 700 21px; body 15px #B9A8CC. Hover: translateY(-5px) + border-color rgba(224,33,138,0.55), transition .3s.

### 5. Portafolio — bg #1D0B2E
8 square logo tiles (grid minmax 160px, aspect-ratio 1, radius 20px, bg rgba(255,255,255,0.04), 16px padding) — each holds a client-logo image placeholder (object-fit: contain). Real logos to be supplied by the client.

### 6. Planes — bg #170824
H2 "Ni caro, ni barato… rentable". Four cards (grid minmax 260px, stretch): Growth Social Media, Webinars, Chatbot IA (highlighted), Eventos. Card: 24px radius, 30px padding, flex column, CTA pinned to bottom (`margin-top:auto`). Feature rows: em-dash bullet in #E0218A + 14.5px #DCCDEB text. Chatbot IA card: 1.5px gradient border over #26103D, "Popular" badge (absolute, top -12px right 22px, gradient pill, 12px 800 uppercase), price "$700/mes + IVA" Sora 800 28px, gradient CTA "Empezar ahora". Others: price "A la medida", outlined CTA "Cotizar". Note in intro copy: ad spend (pauta) is separate from monthly fee.

### 7. FAQ — bg #1D0B2E, max-width 840px
5 accordion items using native `<details>/<summary>`: row 22px vertical padding, bottom border rgba(255,255,255,0.1), question Sora 600 17px, "+" indicator #E0218A 22px, answer 15.5px #B9A8CC. Questions cover: pauta not included in fee; platforms (TikTok, Meta, Google Ads, LinkedIn, Spotify Ads + traditional); works from USA to Panama; prices exclude IVA; how to start.

### 8. CTA band — inside #1D0B2E section
Full-width card, radius 32px, gradient bg (120deg, #3D7DBB → #E0218A), padding clamp(48px,8vw,88px) vertical, centered. Two decorative circle outlines (rgba(255,255,255,0.15–0.2)) overflowing corners. H2 Sora 800 clamp(30px,5vw,54px) white "¿Cuándo empezamos?". Button: dark pill (#170824 bg, white text) "Escríbenos — www.padsv.com" → links to https://www.padsv.com.

### 9. Footer — bg #170824, top border rgba(255,255,255,0.07)
Flex row (wrap, space-between): logo + tagline "Creamos ideas que generan GRANDES negocios." (#B9A8CC 14px); anchor links + www.padsv.com; copyright "© 2026 pixels." in #7E6B93 13px.

## Interactions & Behavior
- **Smooth-scroll anchor navigation** (`scroll-behavior: smooth`) for all nav/footer links.
- **Scroll-reveal animation**: elements marked with a stagger index start at opacity 0 / translateY(26px) and animate to visible when they enter the viewport (trigger ≈ top < 94% of viewport height, reveal once). Transition: opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1), delay = index × 0.08s. In production use IntersectionObserver. Honor `prefers-reduced-motion` by disabling.
- **Hero blobs**: infinite CSS keyframe float (translate ±40–50px, 16s/20s ease-in-out).
- **Hover states**: nav links color→white; primary buttons translateY(-2px)+magenta glow shadow; outlined buttons border→#E0218A; service cards lift -5px + magenta border.
- **Mobile menu**: hamburger toggles full-screen overlay; any link click closes it.
- **Language toggle (ES/EN)**: pill button swaps all copy between Spanish and English. Prototype stores both languages in a keyed dictionary (see the `I18N` map in the DC file's logic class — full ES + EN copy for every string) and swaps text by key. In production consider two static builds (`/es/`, `/en/`) or a lightweight i18n lib; `<html lang>` must update.
- **Responsive breakpoint**: 900px for nav collapse; all grids use `repeat(auto-fit, minmax(min(100%, Npx), 1fr))` so they collapse naturally without extra media queries; type scales via clamp().

## State Management
- `menuOpen: boolean` — mobile overlay
- `lang: 'es' | 'en'` — current language (ES default)
- `isMobile: boolean` — matchMedia('(max-width: 900px)')
- No data fetching. Optional props in prototype: `heroVariant` ('centered' | 'split' | 'bold'), `defaultLang`, `reducedMotion`.

## Design Tokens
### Colors
- Background base: `#170824` · Background alt (alternating sections): `#1D0B2E` · Card solid: `#26103D`
- Brand gradient: `linear-gradient(90deg, #4AA3DF, #E0218A)` (CTA band uses 120deg #3D7DBB→#E0218A)
- Accent magenta: `#E0218A` · Accent blue: `#4AA3DF` · Soft pink: `#F08BC0` · Soft blue: `#7FBCE8`
- Text primary: `#F4EFF9` · Text secondary: `#CBB8DE` · Body copy: `#DCCDEB` · Muted: `#B9A8CC` · Faint: `#7E6B93`
- Card bg: `rgba(255,255,255,0.03–0.04)` · Card border: `rgba(255,255,255,0.08–0.09)` · Divider: `rgba(255,255,255,0.1)`
### Typography
- Headings/buttons: **Sora** (Google Fonts) — 800 hero/H2-CTA, 700 H2/H3/buttons, 600 FAQ questions
- Body/UI: **Manrope** (Google Fonts) — 400–700
- Scale: hero clamp(38–76px) · H2 clamp(28–44px) · H3 20–21px · body 15–17px · small 13–14.5px
### Spacing & shape
- Section padding: `clamp(64px, 10vw, 110px)` vertical · content max-width 1200px (FAQ 840px)
- Grid gap: 16–20px · Card padding: 26–32px
- Radii: cards 20–24px, hero visual 26–28px, CTA band 32px, pills/buttons 999px
- Shadows: button hover `0 10–12px 26–32px rgba(224,33,138,0.35)`; chips `0 12px 30px rgba(0,0,0,0.35)`

## Assets
- No raster assets shipped. Hero visual (variant B) and 8 portfolio client logos are **placeholders** — client must supply real images/logos.
- Fonts loaded from Google Fonts (Sora + Manrope). For S3/CloudFront, consider self-hosting the woff2 files.
- Logo is pure text ("pixels" + "."), no image file.

## Files
- `design/Pixels Website.dc.html` — full design source: template (all markup + inline styles) and logic class (i18n dictionary with complete ES/EN copy, scroll reveal, menu, language toggle). **Reference only — it cannot render in a browser** (it needs the `support.js` runtime, and its `<sc-if>` conditionals are inert outside that environment).
- Copy source: original agency PDF (padsv.com proposal) — copy in the i18n map was extracted/adapted from it.

## Implementation
The spec above is implemented as a plain static site — no build step, no dependencies.

```
index.html          all markup, semantic sections
css/styles.css      design tokens as custom properties, then components
js/main.js          ES/EN toggle, mobile menu, IntersectionObserver reveal
assets/logos/       8 placeholder client logos (swap for the real files)
design/             original design-component source, for reference
```

Hero ships the **centered** variant (variant A, the spec default). Variants B and C live in the
design source if they're ever needed.

Run it locally with any static server, e.g. `python3 -m http.server 8000`, then open
<http://localhost:8000>. Opening `index.html` via `file://` also works.

### Known deviations from the spec
- Nav collapse is a CSS media query at 900px rather than a JS `isMobile` flag — same breakpoint, no layout shift on load.
- The FAQ `+` marker rotates 45° when its item opens. The spec only defines the static `+`.
- Two spec colors fall below WCAG AA (4.5:1) for normal-size text on `#170824`: the footer copyright
  `#7E6B93` (**4.02:1**) and accent magenta `#E0218A` (**4.34:1**), both used at 13px. Left as
  specified, since colors are marked final — worth raising with the client.

## Deployment target (context)
Static hosting on **AWS S3 + CloudFront**. Build should output plain static files (index.html + assets). Recommended: enable CloudFront compression, HTTP→HTTPS redirect, and a cache policy with long TTL for hashed assets / short TTL for index.html. If SPA-style routing is used, map 403/404 → /index.html.
