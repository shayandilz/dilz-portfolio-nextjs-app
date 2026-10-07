'use client';

import {useActionState} from 'react';
import {submitLead} from '@/src/app/(store)/store/custom-order/actions';

const PROJECT_TYPES = [
    ['theme', 'طراحی قالب اختصاصی'],
    ['plugin', 'توسعه افزونه اختصاصی'],
    ['customize', 'شخصی‌سازی محصولات'],
    ['other', 'سایر'],
];

const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 aria-[invalid=true]:border-rose-500';

function Field({label, name, error, children}) {
    return (
        <div>
            <label htmlFor={name} className="mb-1.5 block text-sm font-bold text-slate-800">{label}</label>
            {children}
            {error && <p id={`${name}-error`} className="mt-1.5 text-sm text-rose-600">{error}</p>}
        </div>
    );
}

export default function CustomOrderForm() {
    const [state, action, pending] = useActionState(submitLead, null);

    if (state?.ok) {
        return (
            <div role="status" className="store-card p-10 text-center">
                <p className="text-2xl font-extrabold text-slate-900">درخواست شما ثبت شد ✓</p>
                <p className="mt-3 text-slate-500">جزئیات پروژه را بررسی می‌کنیم و ظرف یک تا دو روز کاری از طریق راه ارتباطی که وارد کردید با شما تماس می‌گیریم.</p>
            </div>
        );
    }

    const v = state?.values ?? {};
    const e = state?.errors ?? {};
    const invalid = (name) => (e[name] ? {'aria-invalid': true, 'aria-describedby': `${name}-error`} : {});

    return (
        <form action={action} className="store-card space-y-5 p-8 md:p-5" noValidate>
            {state?.message && <p role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{state.message}</p>}

            <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
                <Field label="نام و نام خانوادگی" name="name" error={e.name}>
                    <input id="name" name="name" required minLength={2} maxLength={100} autoComplete="name" defaultValue={v.name} className={inputClass} {...invalid('name')}/>
                </Field>
                <Field label="راه ارتباطی (موبایل، ایمیل یا تلگرام)" name="contact" error={e.contact}>
                    <input id="contact" name="contact" required minLength={5} maxLength={150} dir="auto" defaultValue={v.contact} className={inputClass} {...invalid('contact')}/>
                </Field>
                <Field label="نوع پروژه" name="project_type">
                    <select id="project_type" name="project_type" defaultValue={v.project_type ?? 'theme'} className={inputClass}>
                        {PROJECT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                </Field>
                <Field label="بودجه تقریبی (اختیاری)" name="budget">
                    <input id="budget" name="budget" maxLength={100} placeholder="مثلاً ۲۰ میلیون تومان" defaultValue={v.budget} className={inputClass}/>
                </Field>
            </div>

            <Field label="توضیحات پروژه" name="message" error={e.message}>
                <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={6}
                    placeholder="امکانات مورد نیاز، نمونه سایت‌های مشابه و زمان‌بندی مدنظرتان را بنویسید."
                    defaultValue={v.message}
                    className={inputClass}
                    {...invalid('message')}
                />
            </Field>

            {/* Honeypot, hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="website">وب‌سایت</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off"/>
            </div>

            <button type="submit" disabled={pending} className="store-btn-primary w-full py-4 text-base disabled:opacity-60">
                {pending ? 'در حال ارسال…' : 'ارسال درخواست'}
            </button>
        </form>
    );
}
