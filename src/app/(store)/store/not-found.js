import Link from 'next/link';

export default function StoreNotFound() {
    return (
        <section className="store-container flex flex-col items-center py-28 text-center">
            <p className="text-7xl font-black text-indigo-700">۴۰۴</p>
            <h1 className="mt-4 text-2xl font-extrabold">صفحه مورد نظر پیدا نشد</h1>
            <p className="mt-3 max-w-md text-slate-500">ممکن است این محصول یا صفحه حذف شده یا آدرس آن تغییر کرده باشد.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/store" className="store-btn-primary">صفحه اصلی فروشگاه</Link>
                <Link href="/store/docs" className="store-btn-secondary">مستندات</Link>
            </div>
        </section>
    );
}
