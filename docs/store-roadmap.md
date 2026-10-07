# Roadmap: front-page fixes + Persian WordPress products store

Scope: `dilz-portfolio-nextjs-app` (Next.js 16, Pages Router, Docker → GHCR → Watchtower behind Traefik) and the headless WordPress at `panel.shayan.website` (`shayan-theme`, `mu-plugins/custom-post-types.php`, ACF Pro, Yoast).

Audit date: 2026-10-07. Findings come from the source code and the live site.

---

## Part A: Updates needed now (Phase 0)

### A1. Front page / SEO bugs (high priority)

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | **Canonical and `og:url` point to `https://codecraftconnect.com/`** | Live `<link rel="canonical" href="https://codecraftconnect.com/">`. The value comes from Yoast (`search-route.php:259`, `:356`). | In WP, clear the homepage's Yoast canonical override and check Yoast → Settings → Site basics. Long term, rewrite the backend host to the frontend host in the API (`panel.shayan.website` → `shayan.website`) so every canonical points at the Next site. |
| 2 | **Robots meta is wrong**: it outputs `content="index"` only | `layout/index.js`: `meta_robots.index ?? {} + ', ' + meta_robots.follow ?? {}`. Operator precedence means `follow` is never appended. | `` content={`${meta_robots?.index ?? 'index'}, ${meta_robots?.follow ?? 'follow'}`} ``. This also prevents a crash when `meta_robots` is undefined. |
| 3 | **System dark-mode detection never works in the hook** | `useThemeSwitcher.js`: `'(prefer-color-scheme: dark)'` has a typo. | Change it to `'(prefers-color-scheme: dark)'`. |
| 4 | **Each page embeds the full API response twice** | Home `__NEXT_DATA__` is 124 KB. `favicon` and `headerFooter` are each the full 61 KB payload. `/articles` HTML is 312 KB. | Return only the needed slices from `getStaticProps` (`global.icon`, `global.menu`, `global.social`, `global.contact`, plus the page's own data). Expected result: home HTML under 40 KB. |
| 5 | **`revalidate: 1`** on every page | ISR regenerates on almost every request, so WP gets called constantly. The CDN shows `x-cache: BYPASS`. | Use `revalidate: 3600`, plus on-demand revalidation from a WP `save_post` webhook to a protected `/api/revalidate` route. Then let ArvanCloud cache HTML. |
| 6 | Branding is inconsistent | `og:image:alt="codecraftconnet"` (typo), footer says `© 2023 CodeCraftConnect™`, and `og:type=article` on the homepage | Update Yoast fields. Make the footer year dynamic. Pick one brand name. |
| 7 | `panel.shayan.website` is indexable | Its `robots.txt` contains `Disallow:` (allows everything) | Add `X-Robots-Tag: noindex` on the panel host with a Traefik middleware, or redirect non-`/wp-json` and non-`/wp-admin` traffic to `shayan.website`. Don't use WordPress's "discourage search engines" setting: Yoast would then put `noindex` into the API meta that the frontend uses. |
| 8 | Messy `public/robots.txt` and sitemap whitespace | The template comments are still there, and `<loc>` values contain newlines and indentation | Rewrite robots.txt to a few lines. Trim `<loc>` values in `sitemap.xml.js`. |

### A2. Code hygiene (medium priority)

- **Weather widget** in the footer has a hard-coded WeatherAPI key (`weatherWidget.js`) and is unrelated to the portfolio. Remove it, or move the key to a server API route.
- **Deprecated `objectFit` prop** on `next/image` (`articles/[postSlug].js:43,76`). Use `className="object-cover"` instead.
- **Hydration risk**: `sanitize()` returns raw HTML on the server and DOMPurify output on the client. JSON-LD should not go through DOMPurify at all; use `JSON.stringify` from structured data.
- **Unused dependencies**: `isomorphic-unfetch` and `@vercel/analytics` (its import is commented out). `axios` is only used in the sitemap code and can be replaced with `fetch`.
- **`"lint": "next lint"`** no longer works on Next 16. Replace it with an ESLint flat config, or remove the script.
- **Dependency bumps (safe)**: `next` 16.2.9 → 16.3.x, `react`/`react-dom` 19.0.0 → 19.3.x, `dompurify`, `postcss`, `autoprefixer`, `axios`.
- **Defer**: Tailwind 4 and framer-motion 14 are major upgrades. Do them after the store ships, not at the same time.
- **Duplicate code**: every page repeats the `<Layout headerIcon=… favicon=… />` prop block. Add a `getGlobalProps()` helper. This is needed for item A1-4 anyway.

### A3. WordPress / server (medium priority)

- **ACF Pro 6.0.3** (2022) is very old and has had security releases since. Update it, and update the bundled copy in the `wp-content-sync` image.
- **Watchtower plus `wordpress:latest`** can auto-upgrade WordPress or PHP versions without warning. Pin to a specific tag (e.g. `wordpress:6.x-php8.3-apache`) and let Watchtower update only images you control. Pin MySQL to a minor version.
- **Backups**: confirm there are scheduled `mysqldump` and uploads backups stored off-server before you start changing the data model.
- **`inc/api-menu.php` is empty** but still `require`d. Delete it or populate it.
- **Security**: a root password was shared in plain text. Rotate it, switch to SSH keys, and set `PermitRootLogin prohibit-password`. Keep credentials only in `~/.claude/servers.md` and never in a repo.

**Phase 0 exit criteria**: canonical, robots and og values are correct on all pages; home HTML is under 60 KB; WP is hit only on content changes; dependencies are bumped; images are pinned; backups are verified.

---

## Part B: Persian WordPress products store

### B1. Goal and positioning

This is a standalone Persian (RTL) section that promotes the WordPress themes and plugins you build and sell on **Zhaket (ژاکت)** and **RTL Theme (راست‌چین)**. It is a **showcase plus support hub** that sends buyers to the marketplaces. It does not take payments in v1.

Each product page has one job: get the visitor to click **«خرید از ژاکت» / «خرید از راست‌چین»**.

Secondary jobs:
- Documentation and changelog: reduces support tickets and builds trust.
- Live demos.
- Custom-development leads: «سفارش طراحی اختصاصی».

### B2. Decisions to make first

| Decision | Recommendation | Why |
|---|---|---|
| URL | `shayan.website/store/...` (Latin slugs) | Shares domain authority, needs no Traefik or certificate changes, and avoids percent-encoded Persian URLs. A separate brand domain can be added later with a 301 redirect, but decide before launch because moving URLs later costs SEO. |
| Brand name | Choose a Persian-friendly brand (for example «دیلز وردپرس») | The marketplaces show a seller name, so the site, seller profiles and plugin headers should all use the same name. |
| Exclusivity | **Check before listing anything** | Both marketplaces set commission based on whether a product is exclusive. Listing the same product on both may break exclusivity terms or lower your revenue share. Read the current seller agreements and decide per product. |
| Links to marketplaces | Use affiliate links if allowed, with UTM parameters | Both marketplaces have affiliate (همکاری در فروش) programs. Confirm that sellers may use them for their own products. |
| Direct sales | **None.** The site is a showcase; every sale happens on Zhaket or RTL Theme | The marketplaces handle payment, licences, refunds and support tickets, which keeps the income passive. |

### B3. Architecture

```
WordPress (panel.shayan.website)                Next.js (shayan.website)
┌──────────────────────────────────┐        ┌──────────────────────────────────────┐
│ mu-plugins/dilz-store/           │  REST  │ src/pages/**   → existing EN site     │
│  CPT dz_product, dz_doc, dz_lead │ ─────▶ │ src/app/(store)/store/** → FA store   │
│  ACF field groups (acf-json)     │        │   own root layout: <html lang="fa"    │
│  REST namespace dilz-store/v1    │        │   dir="rtl">, Vazirmatn, own design   │
│  save_post → revalidate webhook ─┼──────▶ │ src/app/api/revalidate (secret)       │
└──────────────────────────────────┘        └──────────────────────────────────────┘
                                             demo.shayan.website → WP multisite (Phase 4)
```

**Why the App Router for the store only:** Next 16 runs `app/` and `pages/` side by side. A route group `src/app/(store)/` with its **own root layout** gives the store a different `<html lang dir>`, font, header/footer, design tokens and metadata API, without touching the English site. Navigating between the two sections triggers a full page load. That is acceptable because they are separate experiences. The store gets server components, `generateMetadata`, `revalidateTag`, and streaming by default.

**Naming:** use the `dz_` prefix (`dz_product`, `dz_product_cat`). This avoids clashing with WooCommerce's `product` and `product_cat` if WooCommerce is ever installed.

### B4. WordPress data model (`mu-plugins/dilz-store/`)

Put this in its own mu-plugin, not the theme, so it survives a theme switch and is versioned on its own.

**CPT `dz_product`** (محصولات). It supports title, editor (long description), thumbnail and excerpt, has `show_in_rest`, and uses a Yoast metabox.

| Taxonomy | Terms |
|---|---|
| `dz_product_type` | `theme` (قالب), `plugin` (افزونه) |
| `dz_product_cat` | فروشگاهی، شرکتی، آموزشی، المنتور، ووکامرس… |
| `dz_product_tag` | free-form |

**ACF group "اطلاعات محصول"** (saved to `dilz-store/acf-json/` so it is versioned):

| Field | Type | Notes |
|---|---|---|
| `marketplaces` | repeater: `platform` (select: zhaket / rtl-theme), `url`, `price_toman`, `sale_price_toman`, `is_exclusive` | Display the price, but don't treat it as the source of truth. Show a «آخرین قیمت در ژاکت» link. |
| `version`, `released_at`, `updated_at` | text, date, date | |
| `demo_url`, `docs_root` | url, post object → `dz_doc` | |
| `gallery` | gallery | Screenshots and marketplace banner art |
| `video` | url (Aparat or self-hosted) | Prefer Aparat for Iranian visitors |
| `features` | repeater: icon, title, text | |
| `compat` | group: min WP, tested WP, min PHP, Elementor, WooCommerce, RTL ✓, multilingual | Shown as a compatibility table |
| `changelog` | repeater: version, date, items (textarea, one per line) | |
| `faq` | repeater: q, a | Also output as FAQPage JSON-LD |
| `sales_count`, `rating` | number | Fill these by hand from the marketplace. Show them only if they are real. |
| `badge` | select: جدید / پرفروش / به‌روزرسانی | |

**CPT `dz_doc`** (مستندات) is hierarchical and linked to a product, with a menu order. **CPT `dz_lead`** (درخواست‌ها) is private and stores custom-order form submissions.

**ACF options page "تنظیمات فروشگاه"**: hero texts, why-us items, testimonials, support policy, links to the marketplace seller profiles, Telegram/WhatsApp/Eitaa support links, and the footer.

**REST namespace `dilz-store/v1`:**

| Endpoint | Returns |
|---|---|
| `GET /settings` | options page and menus |
| `GET /products?type=&cat=&page=` | lightweight cards: title, slug, type, thumbnail, min price, badge, rating |
| `GET /products/{slug}` | full product, related products, and `yoast_head_json` |
| `GET /docs/{product}/{slug?}` | documentation tree and page |
| `POST /leads` | stores a `dz_lead` and sends `wp_mail`. Protected by a honeypot, a nonce-free rate limit per IP, and optionally ArvanCloud captcha. |

All endpoints go through one serializer per entity. Unlike `search-route.php`, they don't return one large combined payload. Every URL is rewritten from the panel host to the frontend host.

**Webhook:** on `save_post_dz_product`, `save_post_dz_doc` and the options update, call `wp_remote_post( https://shayan.website/api/revalidate, { tag: 'product:<slug>' | 'products' | 'settings' } )` with the `X-Revalidate-Secret` header.

### B5. Next.js store

**Folder layout:**
```
src/app/(store)/
  layout.js                 <html lang="fa" dir="rtl">, Vazirmatn, StoreHeader/Footer, theme tokens
  store/page.js             صفحه اصلی فروشگاه
  store/themes/page.js      قالب‌ها (archive and filters)
  store/plugins/page.js     افزونه‌ها
  store/[type]/[slug]/page.js   صفحه محصول
  store/docs/[product]/[[...slug]]/page.js   مستندات
  store/support/page.js     پشتیبانی و قوانین
  store/custom-order/page.js سفارش اختصاصی (lead form, server action → WP)
  store/about/page.js       درباره ما
  store/sitemap.js, opengraph-image.js
src/app/api/revalidate/route.js
src/lib/store/api.js        fetch wrappers with next: { tags, revalidate: 3600 }
src/lib/store/format.js     toFaDigits, formatToman, formatJalali (Intl 'fa-IR-u-ca-persian')
src/components/store/*      ProductCard, BuyButtons, CompatTable, Changelog, Faq, Gallery…
```

**Design system.** The store should look different from the English portfolio.
- Font: **Vazirmatn** (OFL), self-hosted with `next/font/local` as a variable font. Use Persian digits everywhere with `Intl.NumberFormat('fa-IR')`.
- Prices in «تومان». Dates in the Jalali calendar through `Intl.DateTimeFormat('fa-IR-u-ca-persian')`. No date library needed.
- Tailwind: add `store-*` color tokens and **logical utilities only** (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`, `text-start`). Note that the current config uses desktop-first `max-width` breakpoints. Keep that convention in the store so the two sections don't use opposite breakpoint logic in one config.
- Commerce-style UI: product cards with a badge, price and two marketplace buttons; a sticky buy bar on mobile product pages; trust strip (پشتیبانی ۶ ماهه، به‌روزرسانی رایگان، سازگار با المنتور، کدنویسی استاندارد).
- Light/dark mode is optional. Commerce pages usually use light mode only.

**Product page sections:**
1. Hero: title, short pitch, badge, version, «آخرین به‌روزرسانی ۱۴۰۵/۰۷/۱۵», buy buttons with prices, «مشاهده دمو».
2. Gallery and video.
3. Feature grid.
4. Compatibility table.
5. Description (editor content).
6. Changelog accordion.
7. FAQ.
8. Support policy summary.
9. Related products.

**SEO:**
- `generateMetadata` from `yoast_head_json`.
- JSON-LD: `SoftwareApplication` (`applicationCategory: "WebApplication"`, `operatingSystem: "WordPress"`, `offers` pointing to the marketplace URL with price in IRR), `BreadcrumbList`, `FAQPage`. Add `aggregateRating` only with real marketplace numbers.
- Store sitemap, linked from the existing sitemap index.
- Dynamic OG images per product with an RTL font.

**Analytics:** GA4 events `marketplace_click {platform, product}`, `demo_click`, `lead_submit`. Add UTM `utm_source=shayan.website&utm_medium=store&utm_campaign=<slug>` to outbound links, unless an affiliate link is used.

**Entry from the English site:** add a "WordPress Products (فارسی)" item to the main WP menu and a small banner on `/projects`.

### B6. Live demos (Phase 4)

- Run a separate `wordpress` + `mysql` stack as a **multisite** at `demo.shayan.website`, with one subsite per product, routed by Traefik.
- Reset nightly: a cron job restores each subsite from a snapshot with `wp db import` and resets the uploads folder.
- Restrict access with a shared demo user that has a limited role, and prevent password changes, plugin installs and file edits (`DISALLOW_FILE_MODS`).
- Check server resources first (`docker stats`). If RAM is tight, give the demo stack its own small VPS.

### B7. Product development pipeline (the business side)

Create a separate repository, `dilz-wp-products`, as a monorepo:
```
packages/theme-starter/      block/Elementor-ready theme boilerplate, RTL-first, fa_IR .pot
packages/plugin-starter/     OOP plugin boilerplate (namespaced, PSR-4, Composer autoload)
packages/license-sdk/        adapter interface: ZhaketLicense, RtlThemeLicense
products/<slug>/
tools/release.sh             build assets, strip dev files, zip, generate changelog
.github/workflows/qa.yml     PHPCS (WPCS), PHPStan, Plugin Check / Theme Check, JS build
```

**Marketplace readiness checklist** (confirm against each marketplace's current reviewer guide before submitting):
- [ ] Passes WordPress coding standards, Theme Check / Plugin Check, and has no PHP notices with `WP_DEBUG` enabled
- [ ] Data is escaped, sanitized and nonce-protected. Doesn't load scripts from external CDNs unless the marketplace allows it
- [ ] Fully RTL and translated (`fa_IR`), with a text domain that matches the slug
- [ ] License activation through the marketplace's own license or update API. Each marketplace has its own seller license API; use the SDK adapter.
- [ ] Persian documentation (published as `dz_doc` on the store), a demo, and an import file (one-click demo import for themes)
- [ ] Marketplace assets: cover and banner sizes, screenshots, Persian description, changelog
- [ ] Support policy that matches the marketplace's rules (support is usually handled through the marketplace ticket system)

**Suggested first products**: start with one plugin and one theme. Small, focused plugins get through review faster and teach you each marketplace's review process before you commit to a large theme.

---

## Part C: Timeline

| Phase | Weeks | Deliverables | Done when |
|---|---|---|---|
| **0. Fix and update** | 1 | Part A items, dependency bumps, pinned images, verified backups, password rotated | All Phase 0 exit criteria are met |
| **1. Decisions and content** | 1–2 | Brand name, URL decision, exclusivity per product, seller accounts on both marketplaces, Persian copy for home/support/about, wireframes | Decisions table is complete; copy is in a shared doc |
| **2. WP data model** | 2–3 | `mu-plugins/dilz-store` (CPTs, taxonomies, ACF JSON, options page, REST, webhook), ACF Pro updated, 2 dummy products | `curl /wp-json/dilz-store/v1/products` returns clean, host-rewritten data |
| **3. Store frontend** | 3–6 | App Router group, layout, design tokens, home, archives, product page, docs, support, custom-order form, revalidate route | Lighthouse ≥ 90 on mobile for all four categories; RTL is correct on 360px and desktop widths |
| **4. Demos** | 5–7 | `demo.shayan.website` multisite with nightly reset | Demo resets automatically; a visitor cannot break it |
| **5. SEO, analytics, launch** | 7–8 | JSON-LD, sitemap, OG images, GA4 events, Search Console, menu entry from the English site | Pages indexed; outbound clicks tracked |
| **6. Product pipeline** | Starts in parallel with Phase 2, ongoing | `dilz-wp-products` repo, starters, license SDK, CI, first plugin submitted | First product approved on one marketplace and listed on the store |

**Deploy notes:** the store ships in the same Docker image, so no CI changes are needed beyond adding a `REVALIDATE_SECRET` runtime env var. Pass it to the container at runtime, not as a build arg, so it isn't baked into the image. The WP mu-plugin ships through the `wp-content-sync` image as it does today.

## Risks

- **Marketplace terms**: exclusivity and outbound-linking rules decide the store's call-to-action design. Read them before building the product page.
- **Pages Router and App Router together**: two root layouts and a full reload between sections. Shared components must not depend on `next/router`, since the App Router uses `next/navigation`.
- **Single server**: WP, demos and the frontend share one VPS, and Watchtower auto-updates images. Pin versions and monitor memory once demos exist.
- **Price drift**: marketplace prices change. Label prices as «قیمت در زمان انتشار» and keep the marketplace link as the source of truth.
