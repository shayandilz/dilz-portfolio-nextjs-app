const numberFormat = new Intl.NumberFormat('fa-IR');
const dateFormat = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year: 'numeric', month: 'long', day: 'numeric'});

export const faNumber = (value) => (value === null || value === undefined || value === '' ? '' : numberFormat.format(value));

// Version strings like "1.2.0" keep their dots but use Persian digits.
export const faDigits = (value) => String(value ?? '').replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

export const toman = (value) => (value ? `${faNumber(value)} تومان` : '');

/** "2026-09-20" → "۲۹ شهریور ۱۴۰۵" */
export function jalali(isoDate) {
    if (!isoDate) return '';
    const date = new Date(`${isoDate.slice(0, 10)}T12:00:00Z`);
    return Number.isNaN(date.getTime()) ? '' : dateFormat.format(date);
}

export const PLATFORMS = {
    zhaket: {name: 'ژاکت', buy: 'خرید از ژاکت'},
    'rtl-theme': {name: 'راست‌چین', buy: 'خرید از راست‌چین'},
};

export const TYPES = {
    theme: {slug: 'themes', name: 'قالب', plural: 'قالب‌ها', title: 'قالب‌های وردپرس'},
    plugin: {slug: 'plugins', name: 'افزونه', plural: 'افزونه‌ها', title: 'افزونه‌های وردپرس'},
};

export const typeFromSlug = (slug) => Object.keys(TYPES).find((key) => TYPES[key].slug === slug);

export const BADGES = {
    new: 'جدید',
    bestseller: 'پرفروش',
    updated: 'به‌روزرسانی شده',
    soon: 'به‌زودی',
};

/** Add UTM parameters to outbound marketplace links so sales can be attributed in their reports. */
export function marketplaceUrl(url, campaign) {
    try {
        const outbound = new URL(url);
        if (!outbound.searchParams.has('utm_source')) {
            outbound.searchParams.set('utm_source', 'shayan.website');
            outbound.searchParams.set('utm_medium', 'store');
            if (campaign) outbound.searchParams.set('utm_campaign', campaign);
        }
        return outbound.toString();
    } catch {
        return url;
    }
}

export const effectivePrice = (marketplace) => marketplace.sale_price || marketplace.price;

export const jalaliYear = (date = new Date()) =>
    new Intl.DateTimeFormat('fa-IR-u-ca-persian', {year: 'numeric'}).format(date).replace(/[^۰-۹]/g, '');
