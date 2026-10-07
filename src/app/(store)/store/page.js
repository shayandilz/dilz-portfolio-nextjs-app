import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/src/components/store/ProductCard';
import OutboundLink from '@/src/components/store/OutboundLink';
import CustomOrderBand from '@/src/components/store/CustomOrderBand';
import {EmptyState, Faq, faqJsonLd, JsonLd, SectionHeading} from '@/src/components/store/ui';
import {getProducts, getSettings} from '@/src/lib/store/api';
import {withDefaults} from '@/src/lib/store/content';
import {faNumber, PLATFORMS, TYPES} from '@/src/lib/store/format';

export const revalidate = 3600;

export async function generateMetadata() {
    const [settings, products] = await Promise.all([getSettings(), getProducts()]);
    const s = withDefaults(settings);
    return {
        title: {absolute: `${s.store_name} | قالب و افزونه وردپرس فارسی`},
        description: s.hero_text,
        alternates: {canonical: '/store'},
        openGraph: {title: s.store_name, description: s.store_tagline, url: '/store'},
        // Keep the store out of the index until the first product is published
        robots: products.length ? undefined : {index: false, follow: true},
    };
}

const TRUST = [
    {title: 'خرید امن از مارکت‌پلیس', text: 'ژاکت و راست‌چین'},
    {title: 'لایسنس معتبر', text: 'و فعال‌سازی آسان'},
    {title: 'به‌روزرسانی رایگان', text: 'سازگار با آخرین وردپرس'},
    {title: 'پشتیبانی تیکتی', text: 'پاسخ در روزهای کاری'},
];

export default async function StoreHome() {
    const [rawSettings, products] = await Promise.all([getSettings(), getProducts()]);
    const settings = withDefaults(rawSettings);
    const featured = products.filter((p) => p.badge !== 'soon').slice(0, 6);
    const counts = rawSettings?.counts ?? {};
    const profiles = [
        settings.zhaket_profile && {platform: 'zhaket', href: settings.zhaket_profile},
        settings.rtl_profile && {platform: 'rtl-theme', href: settings.rtl_profile},
    ].filter(Boolean);

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden border-b border-slate-200 bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(67,56,202,0.10),transparent_55%)]" aria-hidden="true"/>
                <div className="store-container relative grid grid-cols-2 items-center gap-12 py-20 lg:grid-cols-1 lg:py-14">
                    <div>
                        <p className="store-eyebrow mb-4">{settings.store_tagline}</p>
                        <h1 className="text-5xl font-black leading-[1.35] xl:text-4xl md:text-3xl">{settings.hero_title}</h1>
                        <p className="mt-6 max-w-xl text-lg leading-9 text-slate-600 md:text-base md:leading-8">{settings.hero_text}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/store/themes" className="store-btn-primary px-7">مشاهده قالب‌ها</Link>
                            <Link href="/store/plugins" className="store-btn-secondary px-7">مشاهده افزونه‌ها</Link>
                        </div>
                    </div>
                    <div className="lg:order-first">
                        {settings.hero_image ? (
                            <Image
                                src={settings.hero_image.url}
                                alt={settings.hero_image.alt || settings.store_name}
                                width={settings.hero_image.width}
                                height={settings.hero_image.height}
                                priority
                                sizes="(max-width: 1023px) 100vw, 560px"
                                className="h-auto w-full rounded-3xl"
                            />
                        ) : (
                            <HeroVisual products={featured}/>
                        )}
                    </div>
                </div>
            </section>

            {/* Trust strip */}
            <section aria-label="مزایای خرید" className="border-b border-slate-200 bg-white">
                <ul className="store-container grid grid-cols-4 divide-x divide-x-reverse divide-slate-100 py-6 lg:grid-cols-2 lg:gap-y-4 lg:divide-x-0">
                    {TRUST.map((item) => (
                        <li key={item.title} className="px-4 text-center">
                            <p className="font-bold text-slate-900">{item.title}</p>
                            <p className="text-sm text-slate-500">{item.text}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Products */}
            <section className="store-container py-20 md:py-14">
                <SectionHeading
                    eyebrow="محصولات"
                    title="جدیدترین قالب‌ها و افزونه‌ها"
                    text="هر محصول با مستندات فارسی، دمو و به‌روزرسانی رایگان عرضه می‌شود."
                    action={products.length > 0 && <Link href="/store/themes" className="store-btn-secondary">همه محصولات</Link>}
                />
                {featured.length ? (
                    <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                        {featured.map((product, index) => (
                            <ProductCard key={product.id} product={product} priority={index < 3}/>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="اولین محصولات به‌زودی منتشر می‌شوند"
                        text="در حال آماده‌سازی قالب‌ها و افزونه‌های جدید برای ژاکت و راست‌چین هستیم. تا آن زمان می‌توانید پروژه اختصاصی خود را به ما بسپارید."
                    >
                        <Link href="/store/custom-order" className="store-btn-primary">ثبت سفارش اختصاصی</Link>
                    </EmptyState>
                )}
            </section>

            {/* Types */}
            {products.length > 0 && (
                <section className="store-container grid grid-cols-2 gap-6 md:grid-cols-1">
                    {Object.entries(TYPES).map(([type, info]) => (
                        <Link
                            key={type}
                            href={`/store/${info.slug}`}
                            className="store-card group flex items-center justify-between p-8 transition-colors hover:border-indigo-300"
                        >
                            <span>
                                <span className="block text-2xl font-extrabold text-slate-900">{info.title}</span>
                                <span className="mt-1 block text-slate-500">
                                    {counts[type] ? `${faNumber(counts[type])} ${info.name}` : 'به‌زودی'}
                                </span>
                            </span>
                            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-700 transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
                        </Link>
                    ))}
                </section>
            )}

            {/* Why us */}
            <section className="store-container py-20 md:py-14">
                <SectionHeading eyebrow="چرا ما؟" title="محصولاتی که برای وب فارسی ساخته شده‌اند"/>
                <div className="grid grid-cols-4 gap-6 lg:grid-cols-2 sm:grid-cols-1">
                    {settings.why_us.map((item, index) => (
                        <div key={item.title} className="store-card p-6">
                            <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 font-bold text-white">
                                {faNumber(index + 1)}
                            </span>
                            <h3 className="font-extrabold">{item.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-slate-500">{item.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials: only real reviews entered in WordPress */}
            {rawSettings?.testimonials?.length > 0 && (
                <section className="bg-slate-900 py-20 md:py-14">
                    <div className="store-container">
                        <p className="store-eyebrow mb-2 text-indigo-300">نظر خریداران</p>
                        <h2 className="store-section-title mb-10 text-white">آن‌ها چه می‌گویند</h2>
                        <div className="grid grid-cols-3 gap-6 lg:grid-cols-1">
                            {rawSettings.testimonials.map((item) => (
                                <figure key={`${item.name}-${item.product}`} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                                    <blockquote className="leading-8 text-slate-200">«{item.text}»</blockquote>
                                    <figcaption className="mt-4 text-sm text-slate-400">
                                        <span className="font-bold text-white">{item.name}</span>
                                        {item.product && ` — ${item.product}`}
                                        {PLATFORMS[item.platform] && ` (خریدار ${PLATFORMS[item.platform].name})`}
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Where to buy */}
            {profiles.length > 0 && (
                <section className="store-container pt-20 md:pt-14">
                    <div className="store-card flex items-center justify-between gap-8 p-10 md:flex-col md:items-start md:p-6">
                        <div>
                            <h2 className="text-2xl font-extrabold">خرید از مارکت‌پلیس‌های معتبر</h2>
                            <p className="mt-2 max-w-xl text-slate-500">
                                همه محصولات از طریق ژاکت و راست‌چین فروخته می‌شوند تا پرداخت امن، لایسنس معتبر و پشتیبانی تیکتی داشته باشید.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {profiles.map((profile) => (
                                <OutboundLink
                                    key={profile.platform}
                                    href={profile.href}
                                    event="marketplace_profile_click"
                                    params={{platform: profile.platform}}
                                    className="store-btn-secondary"
                                >
                                    فروشگاه ما در {PLATFORMS[profile.platform].name}
                                </OutboundLink>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ */}
            <section className="store-container py-20 md:py-14">
                <div className="grid grid-cols-3 gap-12 lg:grid-cols-1 lg:gap-6">
                    <div>
                        <p className="store-eyebrow mb-2">سؤالات متداول</p>
                        <h2 className="store-section-title">پیش از خرید بدانید</h2>
                        <p className="mt-3 text-slate-500">
                            پاسخ سؤال‌تان را پیدا نکردید؟ <Link href="/store/support" className="font-bold text-indigo-700">صفحه پشتیبانی</Link> را ببینید.
                        </p>
                    </div>
                    <div className="col-span-2 lg:col-span-1">
                        <Faq items={settings.faq}/>
                    </div>
                </div>
                <JsonLd data={faqJsonLd(settings.faq)}/>
            </section>

            <CustomOrderBand/>
        </>
    );
}

function HeroVisual({products}) {
    const images = products.filter((p) => p.image).slice(0, 3);
    if (!images.length) {
        return (
            <div className="grid aspect-[4/3] grid-cols-2 gap-4" aria-hidden="true">
                <div className="row-span-2 rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-500"/>
                <div className="rounded-3xl bg-amber-300"/>
                <div className="rounded-3xl bg-slate-900"/>
            </div>
        );
    }
    return (
        <div className="relative aspect-[4/3]">
            {images.map((product, index) => (
                <div
                    key={product.id}
                    className={[
                        'absolute overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-xl',
                        index === 0 && 'inset-x-[8%] top-0 z-10 aspect-[16/10]',
                        index === 1 && 'bottom-0 start-0 w-[55%] aspect-[16/10]',
                        index === 2 && 'bottom-[6%] end-0 w-[50%] aspect-[16/10]',
                    ].filter(Boolean).join(' ')}
                >
                    <Image src={product.image.url} alt="" fill priority={index === 0} sizes="480px" className="object-cover"/>
                </div>
            ))}
        </div>
    );
}
