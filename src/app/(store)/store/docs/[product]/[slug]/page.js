import Link from 'next/link';
import {notFound} from 'next/navigation';
import {Breadcrumbs, breadcrumbJsonLd, JsonLd} from '@/src/components/store/ui';
import {getDoc, getDocsIndex} from '@/src/lib/store/api';
import {jalali} from '@/src/lib/store/format';

export const revalidate = 3600;

const ORIGIN = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'https://shayan.website';
const SLUG = /^[a-z0-9-]+$/;

export async function generateStaticParams() {
    const groups = await getDocsIndex();
    return groups.flatMap((g) => g.docs.map((d) => ({product: g.product, slug: d.slug})));
}

async function load(params) {
    const {product, slug} = await params;
    if (!SLUG.test(product) || !SLUG.test(slug)) notFound();
    const doc = await getDoc(product, slug);
    if (!doc) notFound();
    return {doc, product};
}

export async function generateMetadata({params}) {
    const {doc} = await load(params);
    const productTitle = doc.product?.title;
    return {
        title: productTitle ? `${doc.title} — ${productTitle}` : doc.title,
        description: doc.seo?.description || undefined,
        alternates: {canonical: doc.path},
        robots: doc.seo?.noindex ? {index: false, follow: true} : undefined,
    };
}

export default async function DocPage({params}) {
    const {doc, product} = await load(params);
    const groups = await getDocsIndex();
    const siblings = groups.find((g) => g.product === product)?.docs ?? [];
    const crumbs = [
        {href: '/store', label: 'فروشگاه'},
        {href: '/store/docs', label: 'مستندات'},
        ...(doc.product ? [{href: doc.product.path, label: doc.product.title}] : []),
        {label: doc.title},
    ];

    return (
        <div className="store-container pb-10 pt-10">
            <Breadcrumbs items={crumbs}/>
            <div className="grid grid-cols-4 gap-10 lg:grid-cols-1">
                <aside className="lg:order-last">
                    <nav aria-label="فهرست مستندات" className="store-card sticky top-24 p-4">
                        <p className="mb-2 px-3 text-sm font-bold text-slate-900">{doc.product?.title ?? 'راهنمای عمومی'}</p>
                        <ol className="space-y-1 text-sm">
                            {siblings.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        href={item.path}
                                        aria-current={item.slug === doc.slug ? 'page' : undefined}
                                        className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 aria-[current=page]:bg-indigo-50 aria-[current=page]:font-bold aria-[current=page]:text-indigo-700"
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ol>
                        {doc.product && (
                            <Link href={doc.product.path} className="store-btn-secondary mt-4 w-full">مشاهده و خرید محصول</Link>
                        )}
                    </nav>
                </aside>
                <article className="col-span-3 lg:col-span-1">
                    <h1 className="text-3xl font-black md:text-2xl">{doc.title}</h1>
                    {doc.updated && <p className="mt-2 text-sm text-slate-400">آخرین ویرایش: {jalali(doc.updated)}</p>}
                    <div className="store-prose mt-6" dangerouslySetInnerHTML={{__html: doc.content}}/>
                    <div className="mt-12 rounded-2xl bg-slate-100 p-6 text-sm leading-7 text-slate-600">
                        پاسخ سؤال‌تان را پیدا نکردید؟ از طریق تیکت مارکت‌پلیسی که از آن خرید کرده‌اید با ما در ارتباط باشید.{' '}
                        <Link href="/store/support" className="font-bold text-indigo-700">راهنمای پشتیبانی</Link>
                    </div>
                </article>
            </div>
            <JsonLd
                data={{
                    '@graph': [
                        {
                            '@type': 'TechArticle',
                            headline: doc.title,
                            inLanguage: 'fa',
                            dateModified: doc.updated,
                            url: `${ORIGIN}${doc.path}`,
                            ...(doc.product ? {about: {'@type': 'SoftwareApplication', name: doc.product.title, url: `${ORIGIN}${doc.product.path}`}} : {}),
                        },
                        breadcrumbJsonLd(crumbs, ORIGIN),
                    ],
                }}
            />
        </div>
    );
}
