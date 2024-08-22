import React, {useState} from 'react'
import Link from "next/link";
import Logo from "../Logo";
import {motion, AnimatePresence} from "framer-motion";
import {useRouter} from "next/router";
import {isEmpty} from 'lodash';
import {
    DribbbleIcon,
    GithubIcon,
    LinkedInIcon,
    MailIcon,
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

const CustomLinkMobile = ({ href, title, className = '', toggle, icon, active }) => {
    const router = useRouter();

    return (
        <Link href={href} aria-label={title} className={`${className} relative group text-light dark:text-light my-4 text-2xl`}>
            <div className={'transition duration-75 fill-light'} dangerouslySetInnerHTML={{ __html: router.asPath === href ? active : icon }} />
        </Link>
    );
};
const Navbar = ({header, social, icon}) => {
    const [mode, setMode] = useThemeSwitcher();
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(!isOpen)
    }
    const renderSocialIcon = (iconName) => {
        // Implement your logic for different icons here
        if (iconName === 'GithubIcon') {
            return <GithubIcon className={'lg:fill-light dark:fill-light'}/>;
        } else if (iconName === 'DribbbleIcon') {
            return <DribbbleIcon/>
        } else if (iconName === 'LinkedInIcon') {
            return <LinkedInIcon className={'lg:fill-light dark:fill-light'}/>
        } else if (iconName === 'TwitterIcon') {
            return <TwitterIcon/>
        } else if (iconName === 'MailIcon') {
            return <MailIcon className={'lg:fill-light dark:fill-light'}/>
        } else if (iconName === 'PinterestIcon') {
            return <PinterestIcon/>
        }
        // Add more conditions for other icons if needed
        return null; // Fallback to null if no matching icon is found
    };
    return (
        <header
            className='w-full px-32 py-8 font-medium flex items-center justify-between dark:text-light relative lg:px-12 md:px-12 sm:px-8'>
            <div className={'w-full flex justify-between items-center lg:hidden'}>
                <nav className={'flex gap-4'}>
                    {!isEmpty(header) && header.length ? header.map(menuItems => (
                        <CustomLink key={menuItems?.ID} href={menuItems.url} title={menuItems.title}/>
                    )) : null}
                </nav>
                <nav className={'flex justify-center items-center gap-5 flex-wrap'}>
                    {!isEmpty(social) && social.length ? social.map((socialItems, index) => (
                        <Link aria-label={socialItems.title} key={index} className={'w-9'} href={socialItems.url}
                              target={'_blank'}>
                            {renderSocialIcon(socialItems.title)}
                        </Link>
                    )) : null}
                    <button aria-label={'theme-switcher'}
                            onClick={() => setMode(mode === "light" ? 'dark' : 'light')}
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


            <nav
                className={'fixed h-max bottom-0 mt-auto z-50 hidden lg:inline-block w-full left-0 right-0 justify-center bg-dark dark:bg-[#2d444f] rounded-t-2xl overflow-hidden'}>
                <div className={'flex w-full gap-10 justify-between ps-10'}>
                    {!isEmpty(header) && header.length ? header.map(menuItems => (
                        <CustomLinkMobile key={menuItems?.ID} href={menuItems.url} title={menuItems.title}
                                          icon={menuItems.icon} active={menuItems.icon_active} toggle={handleClick}/>
                    )) : null}
                    <button aria-label={'social_links'} className={`bg-white flex justify-center items-center text-dark w-[4rem] z-30`} onClick={handleClick}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="35"
                             height="35" fill="currentColor"
                             className={`bi bi-arrow-up-short transition-all duration-500 ${isOpen ? 'rotate-180 scale-125' : 'rotate-0'}`}
                             viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                  d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                        </svg>
                    </button>

                </div>
                <AnimatePresence>
                    {
                        isOpen && (

                            <motion.div
                                initial={{opacity: 0, x: '0%', y: '100%'}}
                                animate={{opacity: 1, x: '0%', y: '-100%'}}
                                exit={{opacity: 0, y: '100%'}}
                                transition={{duration: 0.5}}

                                className={'w-screen absolute flex justify-center flex-col items-start bg-dark/90 dark:bg-dark/90 backdrop-blur-sm h-100 border-t border-light rounded-tl-2xl px-5'}>

                                <nav className={'flex justify-center items-center gap-3 flex-wrap py-3'}>
                                    <span className={'text-lg uppercase text-white'}>
                                        contact us :
                                    </span>
                                    {!isEmpty(social) && social.length ? social.map((socialItems, index) => (
                                        <Link scroll={false} key={index} aria-label={socialItems.title} className={'w-9'}
                                              href={socialItems.url} target={'_blank'}>
                                            {renderSocialIcon(socialItems.title)}
                                        </Link>
                                    )) : null}

                                </nav>
                            </motion.div>

                        )
                    }
                </AnimatePresence>
            </nav>


            <button aria-label={'switch-theme'} onClick={() => setMode(mode === "light" ? 'dark' : 'light')}
                    className={`w-9 hidden lg:flex items-center justify-center rounded-full p-1 ${mode === "light" ? 'bg-dark text-light' : 'bg-light text-dark'}`}
            >
                {
                    mode === 'dark' ?
                        <SunIcon className={'fill-dark'}/> :
                        <MoonIcon className={'fill-dark'}/>
                }
            </button>

            <div className={'absolute left-[50%] top-2 translate-x-[-50%]'}>
                <Logo icon={icon}/>
            </div>
        </header>
    )
}

export default Navbar;