# Marketplace research and first product (WP OROD)

Researched 2026-10-07 from public pages. Items marked **verify** must be confirmed with the marketplace seller teams before signing up or choosing exclusivity.

## 1. Seller terms

### RTL Theme (راست‌چین)

| Topic | What is public | Source |
|---|---|---|
| Commission, Iranian products | 20% standard. 10% when customer satisfaction is above the platform average; 30% when below. Satisfaction comes from buyer ratings submitted 7 days after purchase, over a rolling 30-day window, with at least 50 ratings a month. | [smart-profit article, 1400/12/26](https://www.rtl-theme.com/blog/smart-profit/) |
| Commission, localized foreign products | 50% standard (40% / 60% with the satisfaction adjustment). Original products are far more profitable. | same |
| New vendors | First month: 100% of the revenue goes to the vendor for Iranian products. | same |
| Payout | "Instant settlement" in under 2 hours. | [become-vendor](https://www.rtl-theme.com/become-vendor/) |
| Extras | Offers free encoding, cover design and a landing page (for the second product). | same |
| Rules | Hidden links or extra code in a product can lead to suspension and loss of the vendor's rights to it. | [search summary of /designer/](https://www.rtl-theme.com/designer/) |
| Full rules page | `/designer/` blocks automated reading. **Verify:** exclusivity terms, review checklist, support obligations, licence API. | — |

The commission figures come from a 2022 article. **Verify** that they still apply.

### Zhaket (ژاکت)

| Topic | What is public | Source |
|---|---|---|
| Commission | **Not published** on the developer pages. A third-party summary mentions 20% per sale. **Verify** the rate for exclusive and non-exclusive products. | [become-seller](https://www.zhaket.com/landing/become-seller/) |
| Paths | Original Iranian products, or localizing foreign ones. Free consultation during review. | same |
| Licensing | **Zhaket Guard**: optional, only for products the seller designed and coded themselves. One licence per domain. Supports ionCube / SourceGuardian. | [guard](https://www.zhaket.com/content/guard) |
| Guard SDK | The community PHP library (`installLicense`, `isValidLicense`, recommends a check every 24 hours) was archived in July 2026. Use Zhaket's official docs once you have a seller account. | [farhadhp/zhaket-guard](https://github.com/farhadhp/zhaket-guard) |
| Affiliate | 7% of the cart, capped at 100,000 toman per cart, 30-day cookie. This applies to promoting any product, not to our own sales. | [affiliate](https://www.zhaket.com/landing/zhaket-affiliate/) |

### Questions to send both marketplaces before the first submission
1. Commission for an **original Iranian product**, exclusive vs non-exclusive.
2. Can the same product be listed on the other marketplace? Can we link to it from shayan.website/store? (The store only links out; it doesn't sell.)
3. Licence/activation API docs and whether it is mandatory.
4. Review checklist (code standards, encoding allowed or not, required docs/demo).
5. Minimum support period and response time.

## 2. Market signals

- **Zhaket's bestsellers are mostly localized global brands** (Elementor Pro, Yoast, Rank Math, WP Rocket, Woodmart, Astra). Competing there makes no sense; original Iranian products avoid that fight and pay a much lower commission.
- **RTL Theme WooCommerce category** (sample of the listing): a bank gateway with 5,079 sales; Postex shipping with 1,415 sales but a 72% rating; Checkout Field Editor with 502 sales; gold pricing ("Zarin Price") with only 11 sales at 1,695,000 toman. ([category](https://www.rtl-theme.com/category/wordpress-plugin/woocommerce/))
- **Shipping is hard to win:** the free [Persian WooCommerce Shipping](https://wordpress.org/plugins/persian-woocommerce-shipping/) plugin (Post, Tipax, courier, Tapin) is the default choice, and Amadast also exists.
- **Currency/gold-based pricing:** global plugins only handle gold/silver from international APIs. Nothing visible handles Iranian market rates (toman/dollar, USDT, gold per gram from Iranian sources) with margins and rounding.
- **Moadian (سامانه مودیان) e-invoicing:** no WooCommerce plugin surfaced in search. There is real legal demand, but it's complex and support-heavy.

## 3. First product shortlist

| # | Idea | Demand | Competition | Build / support effort | Verdict |
|---|---|---|---|---|---|
| 1 | **Automatic WooCommerce prices from Iranian currency and gold rates** | High: inflation makes stores re-price constantly | Low for Iranian sources | Small / low | **Recommended first product** |
| 2 | Moadian e-invoice submission for WooCommerce | High for registered businesses | Unclear, possibly none | Large / high (signing, keys, legal changes) | Strong second product once we have experience |
| 3 | Better-rated Iranian shipping calculator | Medium | Free strong incumbent | Medium / high (carrier APIs change) | Skip |
| 4 | SMS/OTP login | High | Crowded (Digits and others) | Medium | Skip |

### Product #1 scope (v1)
- Rate sources: dollar, euro, USDT and 18k gold per gram from a configurable Iranian rate API, with a manual override when the source fails.
- Each product or variation gets a base price in a currency or gold weight. The toman price = rate × base × (1 + margin) + fixed costs, rounded (e.g. to the nearest 1,000 toman).
- Scheduled updates (WP-Cron plus a real cron option), bulk edit, a price history log, and an "update now" button.
- Safety rules: skip the update if the rate moves more than X% in one run, and email the admin.
- Persian, RTL, Jalali dates, HPOS-compatible, and works with variable products.
- Price target: around 690,000–990,000 toman, based on what comparable WooCommerce utilities charge in the RTL Theme sample above.

## 4. Next steps
1. You: create seller accounts on both marketplaces and send the five questions above.
2. Me: set up the `wp-orod-products` repo with the plugin starter, CI (PHPCS/WPCS, PHPStan, Plugin Check) and a licence adapter interface, then build product #1.
3. Publish its Persian docs and product page on WP OROD at the same time as the marketplace submission.
