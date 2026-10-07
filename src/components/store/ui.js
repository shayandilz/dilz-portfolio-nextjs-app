import Link from 'next/link';
import {BADGES, faNumber, PLATFORMS} from '@/src/lib/store/format';

export function Stars({rating, count, className = ''}) {
    if (!rating) return null;
    return (
        <span className={`inline-flex items-center gap-1 text-sm ${className}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" className="fill-amber-400" aria-hidden="true">
                <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>
            </svg>
            <span className="font-bold text-slate-900">{faNumber(rating)}</span>
            <span className="sr-only">از ۵</span>
            {count ? <span className="text-slate-400">({faNumber(count)} رأی)</span> : null}
        </span>
    );
}

export function Badge({badge}) {
    if (!badge || !BADGES[badge]) return null;
    const colors = {
        new: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
        bestseller: 'bg-amber-50 text-amber-800 ring-amber-200',
        updated: 'bg-sky-50 text-sky-700 ring-sky-200',
        soon: 'bg-slate-100 text-slate-600 ring-slate-200',
    };
    return (
        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${colors[badge]}`}>
            {BADGES[badge]}
        </span>
    );
}

export function PlatformChips({platforms = []}) {
    return (
        <span className="flex flex-wrap gap-1.5">
            {platforms.filter((p) => PLATFORMS[p]).map((p) => (
                <span key={p} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{PLATFORMS[p].name}</span>
            ))}
        </span>
    );
}

export function SectionHeading({eyebrow, title, text, action}) {
    return (
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-6 md:flex-col md:items-start">
            <div className="max-w-2xl">
                {eyebrow && <p className="store-eyebrow mb-2">{eyebrow}</p>}
                <h2 className="store-section-title">{title}</h2>
                {text && <p className="mt-3 text-slate-500">{text}</p>}
            </div>
            {action}
        </div>
    );
}

export function Breadcrumbs({items}) {
    return (
        <nav aria-label="مسیر صفحه" className="mb-6 text-sm text-slate-500">
            <ol className="flex flex-wrap items-center gap-2">
                {items.map((item, index) => (
                    <li key={item.href ?? item.label} className="flex items-center gap-2">
                        {index > 0 && <span aria-hidden="true" className="text-slate-300">/</span>}
                        {item.href ? (
                            <Link href={item.href} className="hover:text-indigo-700">{item.label}</Link>
                        ) : (
                            <span aria-current="page" className="text-slate-700">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}

/** BreadcrumbList structured data from the same items used by <Breadcrumbs>. */
export function breadcrumbJsonLd(items, origin) {
    return {
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.href ? {item: `${origin}${item.href}`} : {}),
        })),
    };
}

export function JsonLd({data}) {
    // JSON.stringify output escaped for safe embedding in a <script> tag
    const json = JSON.stringify({'@context': 'https://schema.org', ...data}).replace(/</g, '\\u003c');
    return <script type="application/ld+json" dangerouslySetInnerHTML={{__html: json}}/>;
}

export function Faq({items}) {
    if (!items?.length) return null;
    return (
        <div className="divide-y divide-slate-200 store-card">
            {items.map((item) => (
                <details key={item.q} className="group px-6 md:px-4">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 py-5 font-bold text-slate-900">
                        {item.q}
                        <span className="text-xl text-indigo-700 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                    </summary>
                    <p className="pb-5 leading-8 text-slate-600">{item.a}</p>
                </details>
            ))}
        </div>
    );
}

export function faqJsonLd(items) {
    return {
        '@type': 'FAQPage',
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {'@type': 'Answer', text: item.a},
        })),
    };
}

export function EmptyState({title, text, children}) {
    return (
        <div className="store-card flex flex-col items-center px-6 py-16 text-center">
            <h2 className="text-xl font-extrabold">{title}</h2>
            {text && <p className="mt-3 max-w-md text-slate-500">{text}</p>}
            {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
    );
}
