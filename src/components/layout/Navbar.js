import React, {useState} from 'react'
import Link from "next/link";
import Logo from "../Logo";
import {motion} from "framer-motion";
import {useRouter} from "next/router";
import { isEmpty } from 'lodash';
import {
    DribbbleIcon,
    GithubIcon,
    LinkedInIcon,
    MoonIcon,
    PinterestIcon,
    SunIcon,
    TwitterIcon
} from "../Icons";
import useThemeSwitcher from "../hooks/useThemeSwitcher";

const CustomLink = ({href, title, className = ""}) => {
    const router = useRouter()
    return (
        <Link href={href} className={`${className} relative group`}>
            {title}
            <span
                className={`h-[1px] inline-block bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light`}

            >&nbsp;
            </span>
        </Link>
    )
}

const CustomLinkMobile = ({href, title, className = "", toggle}) => {
    const router = useRouter();
    const handleClick = () => {
        toggle();
        router.push(href);
    }
    return (
        <button href={href} className={`${className} relative group text-light dark:text-dark my-2 text-2xl`} onClick={handleClick}>
            {title}
            <span
                className={`h-[1px] inline-block bg-light dark:bg-dark absolute left-0 -bottom-0.5 group-hover:w-full transition-[width] ease duration-300 ${router.asPath === href ? 'w-full' : 'w-0'} dark:bg-light`}

            >&nbsp;
            </span>
        </button>
    )
}
const Navbar = ({header, social}) => {
    const [mode, setMode] = useThemeSwitcher();
    const [isOpen, setIsOpen] = useState(false)

    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    const renderSocialIcon = (iconName) => {
        // Implement your logic for different icons here
        if (iconName === 'GithubIcon') {
            return <GithubIcon />;
        }else if(iconName === 'DribbbleIcon'){
            return <DribbbleIcon />
        }else if (iconName === 'LinkedInIcon'){
            return <LinkedInIcon />
        }else if (iconName === 'TwitterIcon'){
            return <TwitterIcon />
        }else if (iconName === 'PinterestIcon'){
            return <PinterestIcon />
        }
        // Add more conditions for other icons if needed
        return null; // Fallback to null if no matching icon is found
    };
    return (
        <header className='w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light relative z-20 lg:px-16 md:px-12 sm:px-8'>
            <button className={'flex-col justify-center items-center hidden lg:flex'} onClick={handleClick}>
                <span
                    className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'}`}></span>
                <span
                    className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm my-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span
                    className={`bg-dark dark:bg-light block h-0.5 w-6 rounded-sm transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-0.5'}`}></span>
            </button>
            <div className={'w-full flex justify-between items-center lg:hidden'}>
                <nav className={'flex gap-4'}>
                    {!isEmpty(header) && header.length ? header.map(menuItems => (
                        <CustomLink key={ menuItems?.ID } href={menuItems.url} title={menuItems.title}/>
                    )) : null}
                </nav>
                <nav className={'flex justify-center items-center gap-3 flex-wrap'}>
                    {!isEmpty(social) && social.length ? social.map((socialItems, index) => (
                        <Link key={index} className={'w-9'} href={socialItems.url} target={'_blank'}>
                            {renderSocialIcon(socialItems.title)}
                        </Link>
                    )) : null}
                    <button onClick={() => setMode(mode === "light" ? 'dark' : 'light')}
                            className={`ml-3 flex items-center justify-center rounded-full p-1 ${mode === "light" ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                    >
                        {
                            mode === 'dark' ?
                                <SunIcon className={'fill-dark'}/> :
                                <MoonIcon className={'fill-dark'}/>
                        }
                    </button>
                </nav>
            </div>

            {
                isOpen ?
                    <motion.div
                        initial={{scale: 0, opacity: 0, x: '-50%', y: '-50%'}}
                        animate={{scale: 1, opacity: 1}}
                        className={'min-w-[100vw] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between flex-col items-center z-30 bg-dark/90 dark:bg-light/75 rounded-lg backdrop-blur-md py-32'}>
                        <nav className={'flex items-center flex-col justify-center'} >
                            {!isEmpty(header) && header.length ? header.map(menuItems => (
                                <CustomLinkMobile key={ menuItems?.ID } href={menuItems.url} title={menuItems.title} toggle={handleClick}/>
                            )) : null}
                        </nav>
                        <nav className={'flex justify-center items-center gap-3 flex-wrap mt-16'}>
                            {!isEmpty(social) && social.length ? social.map((socialItems, index) => (
                                <Link key={index} className={'w-9'} href={socialItems.url} target={'_blank'}>
                                    {renderSocialIcon(socialItems.title)}
                                </Link>
                            )) : null}
                            <button onClick={() => setMode(mode === "light" ? 'dark' : 'light')}
                                    className={`ml-3 w-9 flex items-center justify-center rounded-full p-1 ${mode === "light" ? 'bg-dark text-light' : 'bg-light text-dark'}`}
                            >
                                {
                                    mode === 'dark' ?
                                        <SunIcon className={'fill-dark'}/> :
                                        <MoonIcon className={'fill-dark'}/>
                                }
                            </button>
                        </nav>
                    </motion.div>

                    : null
            }

            <div className={'absolute left-[50%] top-2 translate-x-[-50%]'}>
                <Logo/>
            </div>
        </header>
    )
}

export default Navbar;