import Link from 'next/link';
import {notFound, permanentRedirect} from 'next/navigation';
import BuyBox, {MobileBuyBar} from '@/src/components/store/BuyBox';
import ProductCard from '@/src/components/store/ProductCard';
import ProductGallery from '@/src/components/store/ProductGallery';
import {Badge, Breadcrumbs, breadcrumbJsonLd, Faq, faqJsonLd, JsonLd, Stars} from '@/src/components/store/ui';
import {getProduct, getProducts} from '@/src/lib/store/api';
import {effectivePrice, faDigits, jalali, PLATFORMS, TYPES, typeFromSlug} from '@/src/lib/store/format';

export const revalidate = 3600;

const ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://shayan.website';

export async function generateStaticParams() {
    const products = await getProducts();
    return products.map((p) => ({type: TYPES[p.type].slug, slug: p.slug}));
}

async function load(params) {
    const {type, slug} = await params;
    if (!typeFromSlug(type) || !/^[a-z0-9-]+$/.test(slug)) notFound();
    const product = await getProduct(slug);
    if (!product) notFound();
    // A product moved between themes/plugins keeps working at its old URL
    if (product.path !== `/store/${type}/${slug}`) permanentRedirect(product.path);
    return product;
}

export async function generateMetadata({params}) {
    const product = await load(params);
    const image = product.seo?.image ?? product.image;
    return {
        title: product.seo?.title && product.seo.title !== product.title ? {absolute: product.seo.title} : product.title,
        description: product.seo?.description || product.tagline || product.excerpt,
        alternates: {canonical: product.path},
        robots: product.seo?.noindex ? {index: false, follow: true} : undefined,
        openGraph: {
            title: product.title,
            description: product.tagline || product.excerpt,
            url: product.path,
            images: image ? [{url: image.url, width: image.width, height: image.height, alt: image.alt || product.title}] : undefined,
        },
    };
}

const COMPAT_ROWS = [
    ['wp_min', 'حداقل نسخه وردپرس'],
    ['wp_tested', 'تست شده تا وردپرس'],
    ['php_min', 'حداقل نسخه PHP'],
    ['woocommerce', 'سازگار با ووکامرس'],
    ['elementor', 'سازگار با المنتور'],
    ['rtl', 'راست‌چین کامل'],
    ['multilingual', 'پشتیبانی از چندزبانه'],
];

function productJsonLd(product) {
    const offers = product.marketplaces
        .filter((m) => effectivePrice(m))
        .map((m) => ({
            '@type': 'Offer',
            url: m.url,
            // schema.org expects ISO 4217; 1 toman = 10 rial
            price: effectivePrice(m) * 10,
            priceCurrency: 'IRR',
            availability: 'https://schema.org/InStock',
            seller: {'@type': 'Organization', name: PLATFORMS[m.platform]?.name},
        }));

    return {
        '@type': 'SoftwareApplication',
        name: product.title,
        description: product.tagline || product.excerpt,
        url: `${ORIGIN}${product.path}`,
        image: product.image?.url,
        applicationCategory: 'WebApplication',
        applicationSubCategory: product.type === 'theme' ? 'WordPress Theme' : 'WordPress Plugin',
        operatingSystem: 'WordPress',
        inLanguage: 'fa',
        softwareVersion: product.version || undefined,
        dateModified: product.updated || undefined,
        datePublished: product.released || undefined,
        offers: offers.length ? offers : undefined,
        // Only real marketplace ratings are entered in WordPress
        aggregateRating: product.rating && product.rating_count
            ? {'@type': 'AggregateRating', ratingValue: product.rating, ratingCount: product.rating_count, bestRating: 5}
            : undefined,
    };
}

export default async function ProductPage({params}) {
    const product = await load(params);
    const info = TYPES[product.type];
    const gallery = [product.image, ...product.gallery].filter(Boolean)
        .filter((img, i, all) => all.findIndex((x) => x.url === img.url) === i);
    const crumbs = [
        {href: '/store', label: 'فروشگاه'},
        {href: `/store/${info.slug}`, label: info.plural},
        {label: product.title},
    ];
    const compat = COMPAT_ROWS.filter(([key]) => product.compat[key]);

    return (
        <>
            <div className="store-container pb-24 pt-10 lg:pb-32">
                <Breadcrumbs items={crumbs}/>

                <div className="grid grid-cols-3 gap-10 lg:grid-cols-1">
                    <div className="col-span-2 lg:col-span-1">
                        <header className="mb-6">
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-bold text-indigo-700">{info.name} وردپرس</span>
                                <Badge badge={product.badge}/>
                                {product.categories.map((c) => (
                                    <span key={c.slug} className="rounded-full bg-slate-100 px-3 py-0.5 text-xs text-slate-600">{c.name}</span>
                                ))}
                            </div>
                            <h1 className="text-4xl font-black leading-[1.4] md:text-3xl">{product.title}</h1>
                            {product.tagline && <p className="mt-3 text-lg text-slate-500 md:text-base">{product.tagline}</p>}
                            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                                <Stars rating={product.rating} count={product.rating_count}/>
                                {product.version && <span>نسخه {faDigits(product.version)}</span>}
                                {product.updated && <span>به‌روزرسانی: {jalali(product.updated)}</span>}
                            </div>
                        </header>

                        <ProductGallery images={gallery} title={product.title}/>

                        {product.features.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-6 text-2xl font-extrabold">ویژگی‌های کلیدی</h2>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-1">
                                    {product.features.map((f) => (
                                        <div key={f.title} className="store-card flex gap-4 p-5">
                                            <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700" aria-hidden="true">✓</span>
                                            <div>
                                                <h3 className="font-bold">{f.title}</h3>
                                                {f.text && <p className="mt-1 text-sm leading-7 text-slate-500">{f.text}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {product.content && (
                            <section className="mt-14">
                                <h2 className="mb-2 text-2xl font-extrabold">معرفی {info.name}</h2>
                                <div className="store-prose" dangerouslySetInnerHTML={{__html: product.content}}/>
                            </section>
                        )}

                        {compat.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-6 text-2xl font-extrabold">سازگاری</h2>
                                <table className="store-card w-full overflow-hidden text-sm">
                                    <tbody className="divide-y divide-slate-100">
                                    {compat.map(([key, label]) => (
                                        <tr key={key}>
                                            <th scope="row" className="w-1/2 bg-slate-50 px-5 py-3 text-start font-medium text-slate-600">{label}</th>
                                            <td className="px-5 py-3 font-bold text-slate-900">
                                                {typeof product.compat[key] === 'boolean' ? <span className="text-emerald-700">✓ بله</span> : faDigits(product.compat[key])}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </section>
                        )}

                        {product.changelog.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-6 text-2xl font-extrabold">تغییرات نسخه‌ها</h2>
                                <div className="store-card divide-y divide-slate-200">
                                    {product.changelog.map((entry, index) => (
                                        <details key={entry.version} open={index === 0} className="group px-6 md:px-4">
                                            <summary className="flex cursor-pointer items-center justify-between py-4">
                                                <span className="font-bold text-slate-900">نسخه {faDigits(entry.version)}</span>
                                                <span className="text-sm text-slate-400">{jalali(entry.date)}</span>
                                            </summary>
                                            <ul className="list-disc space-y-1 pb-5 ps-5 text-sm leading-7 text-slate-600">
                                                {entry.items.map((item) => <li key={item}>{item}</li>)}
                                            </ul>
                                        </details>
                                    ))}
                                </div>
                            </section>
                        )}

                        {product.faq.length > 0 && (
                            <section className="mt-14">
                                <h2 className="mb-6 text-2xl font-extrabold">سؤالات متداول</h2>
                                <Faq items={product.faq}/>
                            </section>
                        )}
                    </div>

                    <aside>
                        <div className="sticky top-24 space-y-4">
                            <BuyBox product={product}/>
                            {product.docs.length > 0 && (
                                <div className="store-card p-6">
                                    <h2 className="mb-3 font-extrabold">مستندات</h2>
                                    <ul className="space-y-2 text-sm">
                                        {product.docs.map((doc) => (
                                            <li key={doc.id}>
                                                <Link href={doc.path} className="text-indigo-700 hover:underline">{doc.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="rounded-2xl bg-slate-100 p-5 text-sm leading-7 text-slate-600">
                                سؤالی پیش از خرید دارید؟ <Link href="/store/support" className="font-bold text-indigo-700">پشتیبانی</Link> یا{' '}
                                <Link href="/store/custom-order" className="font-bold text-indigo-700">سفارش اختصاصی</Link>
                            </div>
                        </div>
                    </aside>
                </div>

                {product.related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="mb-8 text-2xl font-extrabold">محصولات مرتبط</h2>
                        <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                            {product.related.map((p) => <ProductCard key={p.id} product={p}/>)}
                        </div>
                    </section>
                )}
            </div>

            <MobileBuyBar product={product}/>
            <JsonLd
                data={{
                    '@graph': [
                        productJsonLd(product),
                        breadcrumbJsonLd(crumbs, ORIGIN),
                        ...(product.faq.length ? [faqJsonLd(product.faq)] : []),
                    ],
                }}
            />
        </>
    );
}
