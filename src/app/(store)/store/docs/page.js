import Link from 'next/link';
import {Breadcrumbs, EmptyState} from '@/src/components/store/ui';
import {getDocsIndex} from '@/src/lib/store/api';

export const revalidate = 3600;

export const metadata = {
    title: 'مستندات و راهنمای محصولات',
    description: 'راهنمای فارسی نصب، فعال‌سازی لایسنس و تنظیمات قالب‌ها و افزونه‌های وردپرس.',
    alternates: {canonical: '/store/docs'},
};

export default async function DocsIndex() {
    const groups = await getDocsIndex();

    return (
        <section className="store-container pb-10 pt-10">
            <Breadcrumbs items={[{href: '/store', label: 'فروشگاه'}, {label: 'مستندات'}]}/>
            <h1 className="text-4xl font-black md:text-3xl">مستندات و راهنما</h1>
            <p className="mb-10 mt-3 max-w-2xl text-lg text-slate-500 md:text-base">
                راهنمای کامل نصب، فعال‌سازی و تنظیمات هر محصول. پیش از ثبت تیکت پشتیبانی، پاسخ سؤال‌تان را اینجا جست‌وجو کنید.
            </p>

            {groups.length ? (
                <div className="grid grid-cols-2 gap-6 md:grid-cols-1">
                    {groups.map((group) => (
                        <div key={group.product} className="store-card p-6">
                            <div className="mb-4 flex items-center justify-between gap-4">
                                <h2 className="text-xl font-extrabold">{group.title}</h2>
                                {group.product_path && (
                                    <Link href={group.product_path} className="text-sm text-indigo-700 hover:underline">صفحه محصول</Link>
                                )}
                            </div>
                            <ol className="space-y-2">
                                {group.docs.map((doc) => (
                                    <li key={doc.id}>
                                        <Link href={doc.path} className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-indigo-700">
                                            <span className="text-slate-300" aria-hidden="true">←</span>
                                            {doc.title}
                                        </Link>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    ))}
                </div>
            ) : (
                <EmptyState title="مستندات به‌زودی منتشر می‌شوند" text="مستندات هر محصول هم‌زمان با انتشار آن در این بخش قرار می‌گیرد."/>
            )}
        </section>
    );
}
