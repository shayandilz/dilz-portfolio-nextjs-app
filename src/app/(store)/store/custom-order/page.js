import CustomOrderForm from '@/src/components/store/CustomOrderForm';
import {Breadcrumbs} from '@/src/components/store/ui';

export const metadata = {
    title: 'سفارش طراحی قالب و افزونه اختصاصی وردپرس',
    description: 'طراحی قالب اختصاصی، توسعه افزونه و شخصی‌سازی محصولات وردپرس. جزئیات پروژه را بفرستید و برآورد زمان و هزینه بگیرید.',
    alternates: {canonical: '/store/custom-order'},
};

const SERVICES = [
    {title: 'قالب اختصاصی', text: 'طراحی و پیاده‌سازی قالب وردپرس مطابق برند شما، سریع و راست‌چین.'},
    {title: 'افزونه اختصاصی', text: 'توسعه افزونه برای نیازهای خاص کسب‌وکار، اتصال به API و درگاه‌ها.'},
    {title: 'شخصی‌سازی', text: 'تغییر و افزودن امکانات به محصولات ما یا قالب فعلی سایت شما.'},
    {title: 'وردپرس هدلس', text: 'وردپرس به‌عنوان CMS در کنار فرانت‌اند Next.js برای سرعت و امنیت بیشتر.'},
];

export default function CustomOrderPage() {
    return (
        <section className="store-container pb-10 pt-10">
            <Breadcrumbs items={[{href: '/store', label: 'فروشگاه'}, {label: 'سفارش اختصاصی'}]}/>
            <div className="grid grid-cols-5 gap-12 lg:grid-cols-1">
                <div className="col-span-2 lg:col-span-1">
                    <h1 className="text-4xl font-black leading-[1.4] md:text-3xl">سفارش قالب و افزونه اختصاصی</h1>
                    <p className="mt-4 text-lg leading-9 text-slate-500 md:text-base">
                        جزئیات پروژه‌تان را بفرستید. پس از بررسی، برآورد زمان و هزینه را برایتان ارسال می‌کنیم؛ بدون هیچ تعهدی.
                    </p>
                    <ul className="mt-8 space-y-4">
                        {SERVICES.map((s) => (
                            <li key={s.title} className="flex gap-3">
                                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm text-indigo-700" aria-hidden="true">✓</span>
                                <span>
                                    <span className="block font-bold text-slate-900">{s.title}</span>
                                    <span className="text-sm leading-7 text-slate-500">{s.text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="relative col-span-3 lg:col-span-1">
                    <CustomOrderForm/>
                </div>
            </div>
        </section>
    );
}
