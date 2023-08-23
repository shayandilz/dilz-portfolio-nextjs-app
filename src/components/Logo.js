import React from 'react';
import Link from "next/link";
const Logo = () => {
    return (
        <div className={'flex items-center justify-center mt-2'}>
            <Link
                className={'w-16 h-16 border border-solid border-transparent dark:border-light flex justify-center items-center text-light rounded-full text-2xl font-bold bg-dark dark:bg-light dark:text-dark'}
                href={'/'}>Dilz
            </Link>
        </div>
    );
}

export default Logo;