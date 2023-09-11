// WeatherWidget.js
import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [cityName, setCityName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weatherData, setWeatherData] = useState(null);
    const [typingTimer, setTypingTimer] = useState(null);

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
        <div className="weather-widget">
            <div className="search">
                <input
                    type="text"
                    placeholder="Enter a city name"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <ul className="suggestions">
                    {suggestions.map((city, index) => (
                        <li key={index} onClick={() => handleCitySelect(city)}>
                            {city}
                        </li>
                    ))}
                </ul>
            </div>
            {weatherData ? (
                <div>
                    <h3>Current Weather</h3>
                    <p>Location: {weatherData.location.name}</p>
                    <p>Temperature: {weatherData.current.temp_c}°C</p>
                    <img
                        src={weatherData.current.condition.icon}
                        alt={weatherData.current.condition.text}
                    />
                </div>
            ) : (
                <p>Enter a city name to see weather information.</p>
            )}
        </div>
    );
};

export default WeatherWidget;
