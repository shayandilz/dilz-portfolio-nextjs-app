import React from 'react';
import {CircularText} from "./Icons";
import Link from "next/link";

const HireMe = ({email}) => {
    return (
        <div className={'fixed left-4 bottom-4 flex items-center justify-center md:right-8 md:left-auto md:top-0 md:bottom-auto md:absolute sm:right-5'}>
            <div className={'flex items-center justify-center relative w-48 h-auto md:w-24'}>
                <CircularText className={'fill-dark dark:fill-light animate-spin-slow'}/>
                <Link href={'mailto:' + email} className={'absolute flex justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-solid border-transparent bg-dark dark:bg-white text-light dark:text-dark dark:hover:bg-dark dark:hover:text-light h-20 w-20 rounded-full hover:bg-white hover:text-dark hover:border-dark transition md:w-12 md:h-12 md:text-[10px]'}>
                    Hire me
                </Link>
            </div>
        </div>
    );
};

export default HireMe;