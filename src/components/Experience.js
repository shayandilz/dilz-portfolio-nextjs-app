import React, {useRef} from 'react';
import {motion, useScroll} from "framer-motion";
import LiIcon from "../components/LiIcon";
import {isEmpty} from "lodash";

const Details = ({position, company, companyLink, time, address, work}) => {
    const ref = useRef();
    return <li ref={ref} className={'my-8 first:mt-0 last:mb-0 w-[60%] mx-auto flex flex-col items-center justify-between md:w-[80%]'}>
        <LiIcon reference={ref} />
        <motion.div initial={{y:50}} whileInView={{y:0}} transition={{duration: 0.5,type:'spring'}}>
            <h3 className={'capitalize font-bold text-2xl sm:text-xl xs:text-lg'}>{position}  &nbsp;<a href={companyLink} target={'_blank'} className={'text-primary dark:text-primaryDark capitalize'}>@{company}</a>
            </h3>
            <span className={'capitalize font-medium text-dark/75 xs:text-sm '}>
                {time} | {address}
            </span>
            <p className={'font-medium w-full md:text-sm'}>
                {work}
            </p>
        </motion.div>
    </li>
}
const Experience = ({experience}) => {
    const jobs = experience.jobs
    const ref = useRef();
    const {scrollYProgress} = useScroll({
        target: ref,
        offset: ['start end', 'center start']
    })
    return (
        <div className={'my-64 md:my-[7rem] md:border-1 md:border-t md:pt-5'}>
            <h2 className="text-center text-6xl mb-32 md:text-6xl xs:text-4xl md:mb-16">
                {experience.title}
            </h2>
            <div ref={ref} className={'w-[75%] mx-auto relative lg:w-[90%] md:w-full'}>
                <motion.div style={{scaleY: scrollYProgress}} className={'absolute left-9 top-0 w-[4px] h-full bg-dark dark:bg-light origin-top md:w-[2px] md:left-[30px] xs:left-[20px]'} />
                <ul className={'flex flex-col items-center justify-between ml-4 xs:ml-2'}>
                    {!isEmpty(jobs) && jobs.length ? jobs.map((items, index) => (
                        <Details
                            key={index}
                            position={items.job_title}
                            company={items.company['name']}
                            companyLink={items.company['url']}
                            time={items.year}
                            address={items.location}
                            work={items.description}
                        />
                    )) : null}

                </ul>
            </div>
        </div>
    );
};

export default Experience;