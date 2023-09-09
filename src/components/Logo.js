import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Logo = ({ icon }) => {
    const [rotation, setRotation] = useState(180);

    // Function to update the rotation angle
    const rotateLogo = () => {
        setRotation((prevRotation) => prevRotation + 180);
    };

    // Use useEffect to trigger the rotation animation every 10 seconds
    useEffect(() => {
        const rotationInterval = setInterval(rotateLogo, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(rotationInterval);
    }, []);

    return (
        <div className="flex items-center justify-center mt-2">
            <Link
                className="w-16 h-16 border border-solid border-transparent flex justify-center items-center text-light rounded-full text-2xl font-bold bg-dark dark:text-dark dark:bg-light overflow-hidden"
                href="/"
            >
                <motion.div
                    className="dark:invert"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: rotation }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <Image src={icon.url} alt="sd" width={100} height={100} />
                </motion.div>
            </Link>
        </div>
    );
};

export default Logo;
