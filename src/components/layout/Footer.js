import React from 'react';
import WeatherWidget from "@/src/components/weatherWidget";


const Footer = () => {
    return (
        <footer
            className="bg-neutral-200 text-center dark:bg-neutral-700 lg:text-left">
            <div className="p-4 text-center text-neutral-700 dark:text-neutral-200">
                {/* Add the WeatherWidget component here */}
                <div className="mt-4">
                    <WeatherWidget />
                </div>

            </div>
        </footer>
    );
};

export default Footer;