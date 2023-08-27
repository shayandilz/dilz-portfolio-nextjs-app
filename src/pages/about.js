import React, {useEffect, useRef} from 'react';
import Layout from "@/src/components/layout";
import AnimatedText from "../components/AnimatedText";
import {useInView, useMotionValue, useSpring} from "framer-motion";
// import Skills from "@/components/Skills";
import Experience from "../components/Experience";
import TransitionEffect from "../components/TransitionEffect";
import {fetchCommonData} from "@/src/utils/fetchData";
import {isEmpty} from "lodash";

const AnimatedNumbers = ({value}) => {
    const ref = useRef(null)
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {duration: 3000});
    const isInView = useInView(ref, {once: true})

    useEffect(() => {
        if (isInView) {
            motionValue.set(value)
        }
    }, [isInView, motionValue, value])
    useEffect(() => {
        springValue.on('change', (latest) => {
            if (ref.current && latest.toFixed(0) <= value) {
                ref.current.textContent = latest.toFixed(0)
            }
        })
    }, [springValue, value])
    return <span ref={ref}></span>

}

const About = ({favicon, headerFooter, about, meta}) => {
    const features = about.main.bio.features
    const experience = about.main.experience
    return (
        <Layout
            favicon={favicon.global.icon}
            headerFooter={headerFooter.global.menu || {}}
            socialAccounts={headerFooter.global.social || {}}
            siteTitle={about.data.title}
            metaData={meta}
        >
            <TransitionEffect/>
            <div className={'w-full flex flex-col justify-center items-center dark:text-light'}>
                <section className={'pt-16'}>
                    <AnimatedText className={'mb-16 lg:!text-7xl sm:!text-5xl xs:!text-4xl sm:mb:8'}
                                  text='Know About Us'/>
                    <div className={'grid w-full grid-cols-8 gap-16 sm:gap-8 py-2'}>
                        <div
                            className={'col-span-3 flex flex-col justify-start items-start xl:col-span-4 md:col-span-8'}>
                            <h2 className={'mb-4 text-lg font-bold uppercase'}>{about.main.bio.title}</h2>
                            <div className={'text-justify prose dark:text-light'} dangerouslySetInnerHTML={{ __html: about.main.bio.text }} />
                        </div>
                        <div
                            className="col-span-2 xl:col-span-8 xl:items-center flex flex-col gap-16 justify-between items-start">
                            {!isEmpty(features) && features.length ? features.map((items, index) => (
                                <div key={index} className={'flex flex-col items-start justify-center xl:items-center'}>
                                    <span className={'text-6xl font-bold md:text-6xl sm:text-4xl xs:text-3xl'}>
                                       {items?.title}
                                    </span>
                                    <h2 className={'text-xl xl:text-center md:text-lg sm:text-base xs:text-sm'}>
                                        {items?.subtitle}
                                    </h2>
                                </div>
                            )) : null}
                        </div>
                    </div>
                    {/*<Skills />*/}
                    <Experience experience={experience}/>
                </section>
            </div>
        </Layout>
    )
}
export default About;


export async function getStaticProps() {
    const data = await fetchCommonData();

    return {
        props: {
            meta: data?.pages?.about?.yoast_meta ?? {},
            favicon: data ?? {},
            headerFooter: data ?? {},
            about: data?.pages?.about ?? {},
        },
        revalidate: 1,
    }
}