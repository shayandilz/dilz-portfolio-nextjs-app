import Link from 'next/link';
import {notFound} from 'next/navigation';
import ProductGrid from '@/src/components/store/ProductGrid';
import CustomOrderBand from '@/src/components/store/CustomOrderBand';
import {Breadcrumbs, breadcrumbJsonLd, EmptyState, JsonLd} from '@/src/components/store/ui';
import {getProducts} from '@/src/lib/store/api';
import {TYPES, typeFromSlug} from '@/src/lib/store/format';

export const revalidate = 3600;

export function generateStaticParams() {
    return Object.values(TYPES).map((t) => ({type: t.slug}));
}

const INTRO = {
    theme: 'قالب‌های وردپرس راست‌چین، سریع و سازگار با ووکامرس و المنتور؛ با دمو، مستندات فارسی و به‌روزرسانی رایگان.',
    plugin: 'افزونه‌های وردپرس برای فروشگاه، سئو و سرعت؛ سبک، امن و ساخته‌شده برای سایت‌های فارسی.',
};

export async function generateMetadata({params}) {
    const type = typeFromSlug((await params).type);
    if (!type) return {};
    const products = await getProducts({type});
    return {
        title: TYPES[type].title,
        description: INTRO[type],
        alternates: {canonical: `/store/${TYPES[type].slug}`},
        robots: products.length ? undefined : {index: false, follow: true},
    };
}

export default async function ArchivePage({params}) {
    const type = typeFromSlug((await params).type);
    if (!type) notFound();
    const info = TYPES[type];
    const products = await getProducts({type});
    const crumbs = [{href: '/store', label: 'فروشگاه'}, {label: info.plural}];
    const origin = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://shayan.website';

    return (
        <>
            <section className="store-container pb-20 pt-10">
                <Breadcrumbs items={crumbs}/>
                <h1 className="text-4xl font-black md:text-3xl">{info.title}</h1>
                <p className="mb-10 mt-3 max-w-2xl text-lg text-slate-500 md:text-base">{INTRO[type]}</p>
                {products.length ? (
                    <ProductGrid products={products}/>
                ) : (
                    <EmptyState
                        title={`${info.plural} به‌زودی منتشر می‌شوند`}
                        text="به‌محض انتشار، از همین صفحه و از طریق ژاکت و راست‌چین در دسترس خواهند بود."
                    >
                        <Link href="/store" className="store-btn-secondary">بازگشت به فروشگاه</Link>
                        <Link href="/store/custom-order" className="store-btn-primary">سفارش اختصاصی</Link>
                    </EmptyState>
                )}
            </section>
            <CustomOrderBand/>
            <JsonLd
                data={{
                    '@graph': [
                        breadcrumbJsonLd(crumbs, origin),
                        {
                            '@type': 'ItemList',
                            name: info.title,
                            itemListElement: products.map((p, i) => ({'@type': 'ListItem', position: i + 1, url: `${origin}${p.path}`, name: p.title})),
                        },
                    ],
                }}
            />
        </>
    );
}
