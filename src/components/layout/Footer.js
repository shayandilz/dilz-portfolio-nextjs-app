import React from 'react';
import {isEmpty} from "lodash";
import {useRouter} from "next/router";
import Link from "next/link";
import Logo from "@/src/components/Logo";
import WeatherWidget from "@/src/components/weatherWidget";


const CustomLink = ({href, title, className = ""}) => {
    const router = useRouter()
    return (
        <Link href={href} className={`${className} relative group dark:text-light`}>
            {title}
            <span
                className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light`}

            >&nbsp;
            </span>
        </Link>
    )
}

const Footer = ({header, social, icon}) => {
    return (

        <footer className={'pb-3'}>
            <div className="bg-white rounded-lg shadow dark:bg-light/10 pt-4 mx-5 mb-2 lg:my-20 text-center">
                <Logo icon={icon}/>
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex flex-col md:items-center md:justify-between">
                    <nav className={'flex gap-4 justify-center pt-3 pb-3'}>
                        {!isEmpty(header) && header.length ? header.map(menuItems => (
                            <CustomLink key={menuItems?.ID} href={menuItems.url} title={menuItems.title}/>
                        )) : null}
                    </nav>
                    <WeatherWidget />
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400 mt-5">© 2023
                      <a href="https://codecraftconnect.com" className="hover:underline"> CodeCraftConnect™</a>. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>

    );
};

export default Footer;