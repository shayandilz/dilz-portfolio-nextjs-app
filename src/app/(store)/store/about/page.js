import Link from 'next/link';
import CustomOrderBand from '@/src/components/store/CustomOrderBand';
import {Breadcrumbs} from '@/src/components/store/ui';
import {getSettings} from '@/src/lib/store/api';
import {withDefaults} from '@/src/lib/store/content';

export const revalidate = 3600;

export const metadata = {
    title: 'درباره ما',
    description: 'تیم توسعه قالب و افزونه وردپرس برای وب فارسی.',
    alternates: {canonical: '/store/about'},
};

export default async function AboutPage() {
    const settings = withDefaults(await getSettings());

    return (
        <>
            <section className="store-container pb-20 pt-10">
                <Breadcrumbs items={[{href: '/store', label: 'فروشگاه'}, {label: 'درباره ما'}]}/>
                <div className="grid grid-cols-3 gap-10 lg:grid-cols-1">
                    <div className="col-span-2 lg:col-span-1">
                        <h1 className="mb-6 text-4xl font-black md:text-3xl">درباره {settings.store_name}</h1>
                        <div className="store-prose text-lg" dangerouslySetInnerHTML={{__html: settings.about_text}}/>
                    </div>
                    <aside className="store-card h-fit p-6">
                        <h2 className="mb-2 font-extrabold">نمونه‌کارهای ما</h2>
                        <p className="mb-4 text-sm leading-7 text-slate-500">
                            پروژه‌های وردپرس و هدلسی که برای مشتریان ساخته‌ایم را در پورتفولیو ببینید.
                        </p>
                        <Link href="/projects" className="store-btn-secondary w-full">مشاهده پروژه‌ها (انگلیسی)</Link>
                    </aside>
                </div>
            </section>
            <CustomOrderBand/>
        </>
    );
}
