'use server';

import {headers} from 'next/headers';

const TYPES = ['theme', 'plugin', 'customize', 'other'];

/**
 * Sends the custom-order form to WordPress (dilz-store/v1/leads).
 * The shared secret never reaches the browser; the visitor IP is forwarded for WP's rate limit.
 */
export async function submitLead(_previous, formData) {
    // Honeypot: real visitors never see or fill this field
    if (formData.get('website')) {
        return {ok: true};
    }

    const values = {
        name: String(formData.get('name') ?? '').trim(),
        contact: String(formData.get('contact') ?? '').trim(),
        project_type: TYPES.includes(formData.get('project_type')) ? formData.get('project_type') : 'other',
        budget: String(formData.get('budget') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
    };

    const errors = {};
    if (values.name.length < 2) errors.name = 'نام خود را وارد کنید.';
    if (values.contact.length < 5) errors.contact = 'شماره تماس، ایمیل یا آیدی تلگرام را وارد کنید.';
    if (values.message.length < 10) errors.message = 'توضیحات پروژه باید حداقل ۱۰ کاراکتر باشد.';
    if (Object.keys(errors).length) {
        return {ok: false, errors, values};
    }

    const requestHeaders = await headers();
    const clientIp = (requestHeaders.get('ar-real-ip') || requestHeaders.get('x-forwarded-for') || '').split(',')[0].trim();

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL}/wp-json/dilz-store/v1/leads`, {
            method: 'POST',
            cache: 'no-store',
            headers: {
                'Content-Type': 'application/json',
                'X-Dilz-Secret': process.env.REVALIDATE_SECRET ?? '',
                'X-Client-IP': clientIp,
            },
            body: JSON.stringify(values),
        });
        if (response.status === 429) {
            return {ok: false, values, message: 'تعداد درخواست‌ها زیاد است؛ لطفاً یک ساعت دیگر دوباره تلاش کنید.'};
        }
        if (!response.ok) {
            throw new Error(`WordPress responded ${response.status}`);
        }
        return {ok: true};
    } catch (error) {
        console.error('[store] lead submission failed:', error.message);
        return {ok: false, values, message: 'ارسال درخواست با خطا مواجه شد. لطفاً دوباره تلاش کنید یا از راه‌های ارتباطی پایین صفحه پیام دهید.'};
    }
}
