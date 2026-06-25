import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Services = ({ services }) => {
    const [index, setIndex] = useState(0);
    const itemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    const handleTabClick = (itemIndex) => {
        setIndex(itemIndex);
    };

    return (
        <div>
            <div className={"flex gap-x-10 xl:gap-x-8 mx-auto xl:mx-0 mb-4 xl:justify-center"}>
                {services.map((item, itemIndex) => {
                    return (
                        <div key={itemIndex}
                             className={`${index === itemIndex && 'text-primary after:w-[100%] dark:after:bg-primary after:bg-primary after:transition-all after:duration-300'} font-semibold cursor-pointer capitalize xl:text-lg relative after:w-8 after:h-[2px] after:bg-dark dark:after:bg-white after:absolute after:bottom-[-5px] after:left-0 text-xl`}
                             onClick={() => setIndex(itemIndex)}>
                            {item.title}
                        </div>
                    )
                })}
            </div>
            <div className={"mt-10 "}>
                <div className="relative flex xl:justify-center">
                    {services.map((item, itemIndex) => {
                        return (
                            <div
                                className={'absolute flex flex-wrap gap-x-10 gap-y-5 xl:justify-center'}
                                key={itemIndex}
                            >
                                {item.items.map((subItem, subItemIndex) => (
                                    <motion.div
                                        className={"flex gap-3 align-middle items-center"}
                                        key={subItemIndex}
                                        initial="hidden"
                                        animate={
                                            index === itemIndex
                                                ? subItemIndex === 0
                                                    ? "visible"
                                                    : { opacity: 1, y: 0, transition: { duration: 0.5, delay: subItemIndex * 0.4 } }
                                                : "hidden"
                                        }
                                        variants={itemVariants}
                                    >
                                        <Image
                                            src={subItem.icon.url}
                                            alt={subItem.icon.alt}
                                            className={'dark:invert'}
                                            width={30}
                                            height={30}
                                        />
                                        <span className={"text-dark dark:text-light font-bold"}>
                      {subItem.service_name}
                    </span>
                                    </motion.div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Services;
