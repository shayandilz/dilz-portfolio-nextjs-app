import Link from 'next/link';
import OutboundLink from '@/src/components/store/OutboundLink';
import {Breadcrumbs, Faq, faqJsonLd, JsonLd} from '@/src/components/store/ui';
import {getSettings} from '@/src/lib/store/api';
import {withDefaults} from '@/src/lib/store/content';

export const revalidate = 3600;

export const metadata = {
    title: 'پشتیبانی و قوانین',
    description: 'نحوه دریافت پشتیبانی، زمان پاسخ‌گویی و شرایط بازگشت وجه محصولات وردپرس.',
    alternates: {canonical: '/store/support'},
};

const STEPS = [
    {title: 'مستندات را ببینید', text: 'پاسخ بیشتر سؤال‌ها در راهنمای فارسی هر محصول آمده است.', href: '/store/docs', cta: 'مستندات'},
    {title: 'تیکت ثبت کنید', text: 'از حساب کاربری خود در ژاکت یا راست‌چین، برای محصول خریداری‌شده تیکت بفرستید.'},
    {title: 'پاسخ بگیرید', text: 'تیکت‌ها معمولاً در کمتر از ۲۴ ساعت کاری پاسخ داده می‌شوند.'},
];

export default async function SupportPage() {
    const settings = withDefaults(await getSettings());
    const profiles = [
        settings.zhaket_profile && {href: settings.zhaket_profile, label: 'پنل ژاکت', platform: 'zhaket'},
        settings.rtl_profile && {href: settings.rtl_profile, label: 'پنل راست‌چین', platform: 'rtl-theme'},
    ].filter(Boolean);

    return (
        <section className="store-container pb-10 pt-10">
            <Breadcrumbs items={[{href: '/store', label: 'فروشگاه'}, {label: 'پشتیبانی'}]}/>
            <h1 className="text-4xl font-black md:text-3xl">پشتیبانی</h1>
            <p className="mb-10 mt-3 max-w-2xl text-lg text-slate-500 md:text-base">
                پشتیبانی همه محصولات از طریق مارکت‌پلیسی انجام می‌شود که از آن خرید کرده‌اید.
            </p>

            <ol className="mb-14 grid grid-cols-3 gap-6 lg:grid-cols-1">
                {STEPS.map((step, index) => (
                    <li key={step.title} className="store-card p-6">
                        <span className="mb-3 block text-sm font-bold text-indigo-700">مرحله {['اول', 'دوم', 'سوم'][index]}</span>
                        <h2 className="text-lg font-extrabold">{step.title}</h2>
                        <p className="mt-2 text-sm leading-7 text-slate-500">{step.text}</p>
                        {step.href && <Link href={step.href} className="mt-4 inline-block text-sm font-bold text-indigo-700">{step.cta} ←</Link>}
                    </li>
                ))}
            </ol>

            <div className="grid grid-cols-3 gap-10 lg:grid-cols-1">
                <div className="store-card col-span-2 p-8 lg:col-span-1 md:p-5">
                    <div className="store-prose" dangerouslySetInnerHTML={{__html: settings.support_text}}/>
                </div>
                <aside className="space-y-4">
                    {profiles.length > 0 && (
                        <div className="store-card p-6">
                            <h2 className="mb-3 font-extrabold">ثبت تیکت</h2>
                            <div className="space-y-2">
                                {profiles.map((p) => (
                                    <OutboundLink key={p.href} href={p.href} event="support_click" params={{platform: p.platform}} className="store-btn-secondary w-full">
                                        {p.label}
                                    </OutboundLink>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="rounded-2xl bg-indigo-50 p-6 text-sm leading-7 text-indigo-900">
                        برای شخصی‌سازی یا امکانات جدید که شامل پشتیبانی نیست، از <Link href="/store/custom-order" className="font-bold underline">سفارش اختصاصی</Link> استفاده کنید.
                    </div>
                </aside>
            </div>

            <div className="mt-16">
                <h2 className="store-section-title mb-6">سؤالات متداول</h2>
                <Faq items={settings.faq}/>
                <JsonLd data={faqJsonLd(settings.faq)}/>
            </div>
        </section>
    );
}
