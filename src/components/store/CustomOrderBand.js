import Link from 'next/link';

export default function CustomOrderBand() {
    return (
        <section className="store-container">
            <div className="flex items-center justify-between gap-8 rounded-3xl bg-indigo-700 p-12 text-white md:flex-col md:items-start md:p-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-white md:text-2xl">قالب یا افزونه اختصاصی می‌خواهید؟</h2>
                    <p className="mt-3 max-w-xl text-indigo-100">
                        از طراحی قالب اختصاصی تا توسعه افزونه و شخصی‌سازی محصولات، پروژه‌تان را برای ما بفرستید تا برآورد زمان و هزینه را دریافت کنید.
                    </p>
                </div>
                <Link href="/store/custom-order" className="store-btn-accent shrink-0 px-8">ثبت سفارش اختصاصی</Link>
            </div>
        </section>
    );
}
