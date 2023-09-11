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
        }, 1000);

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
        <div className="weather-widget relative">
            <div className="search relative">
                <input
                    type="text"
                    placeholder="Enter a city name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                />
                <AnimatePresence>
                    {showSuggestions && (
                        <motion.div
                            className="tooltip top-0 right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <ul className="suggestions">
                                {suggestions.map((city, index) => (
                                    <motion.li
                                        key={index}
                                        onClick={() => handleCitySelect(city)}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
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
                <div>
                    <h3 className="text-lg font-semibold">Current Weather</h3>
                    <p>Location: {weatherData.location.name}</p>
                    <p>Temperature: {weatherData.current.temp_c}°C</p>
                    <img
                        src={weatherData.current.condition.icon}
                        alt={weatherData.current.condition.text}
                        className="w-16 h-16"
                    />
                </div>
            ) : (
                <p className="mt-4 text-gray-500">
                    Enter a city name to see weather information.
                </p>
            )}
        </div>
    );
};

export default WeatherWidget;
