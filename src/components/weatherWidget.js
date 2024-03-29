import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WeatherWidget = () => {
    const [cityName, setCityName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [typingTimer, setTypingTimer] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Define your WeatherAPI key
    const apiKey = '424e382e7ed347fe86484215231109';

    useEffect(() => {
        if (cityName.trim() === '') {
            setSuggestions([]); // Clear suggestions if input is empty
            return;
        }

        // Clear any existing timer
        if (typingTimer) {
            clearTimeout(typingTimer);
        }

        // Set a timer to fetch city suggestions after 1 second of inactivity
        const timer = setTimeout(() => {
            fetchCitySuggestions();
        }, 500);

        // Store the timer ID in the state
        setTypingTimer(timer);
    }, [cityName]);

    const fetchCitySuggestions = async () => {
        try {
            const suggestUrl = `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`;
            const response = await fetch(suggestUrl);
            const data = await response.json();
            setSuggestions(data.map((city) => city.name));
            setShowSuggestions(true); // Show suggestions when data is available
        } catch (error) {
            console.error('Error fetching city suggestions:', error);
        }
    };

    const handleCitySelect = async (selectedCity) => {
        // Fetch weather data for the selected city from the WeatherAPI
        try {
            const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}`;
            const response = await fetch(weatherUrl);
            const data = await response.json();
            setWeatherData(data);
            setCityName(''); // Clear the input field
            setSuggestions([]); // Clear suggestions
            setShowSuggestions(false); // Hide suggestions after selection
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const handleKeyDown = (e) => {
        // Handle "Enter" key press
        if (e.key === 'Enter') {
            // Clear any existing timer
            if (typingTimer) {
                clearTimeout(typingTimer);
            }
            fetchCitySuggestions();
        }
    };

    return (
        <div className="weather-widget relative my-5 lg:w-full w-1/4 lg:mx-0 mx-auto border border-1 dark:border-light/20 border-dark/20 rounded-lg p-5 bg-dark/10 dark:bg-white/10 dark:text-white">
            <div className="search relative">
                <h2 className={'text-center font-semibold pb-5'}>
                    JUST FOR FUN
                </h2>
                <input
                    type="text"
                    placeholder="Enter a city name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500 dark:text-dark"
                />
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            className="tooltip mx-auto top-0 right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ul className="suggestions">
                                {suggestions.map((city, index) => (
                                    <motion.li
                                        key={index}
                                        onClick={() => handleCitySelect(city)}
                                        className="p-2 cursor-pointer hover:bg-gray-100 dark:text-dark"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ delay: index * 0.1 }} // Delay by 0.1s for each item
                                    >
                                        {city}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {weatherData ? (
                <div className={'mt-5'}>
                    <p>Current Weather : <span className={'font-semibold'}>{weatherData.location.name}</span></p>
                    <div className={'inline-flex gap-5 items-center justify-center'}>
                        <p>Temperature: <span className={'font-semibold'}>{weatherData.current.temp_c}°C</span></p>
                        <img
                            src={weatherData.current.condition.icon}
                            alt={weatherData.current.condition.text}
                            className="w-12 h-12"
                        />
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-gray-500 dark:text-light">
                    Enter a city name to see weather information.
                </p>
            )}
        </div>
    );
};

export default WeatherWidget;
