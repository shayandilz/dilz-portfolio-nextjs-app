
// WeatherWidget.js
import React, { useState, useEffect } from 'react';

const WeatherWidget = () => {
    const [cityName, setCityName] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [weatherData, setWeatherData] = useState(null);

    // Define your WeatherAPI key
    const apiKey = '424e382e7ed347fe86484215231109';

    useEffect(() => {
        if (cityName.trim() === '') {
            setSuggestions([]); // Clear suggestions if input is empty
            return;
        }

        // Fetch city suggestions from the WeatherAPI
        const fetchCitySuggestions = async () => {
            try {
                const suggestUrl = `http://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${cityName}`;
                const response = await fetch(suggestUrl);
                const data = await response.json();
                setSuggestions(data.map((city) => city.name));
            } catch (error) {
                console.error('Error fetching city suggestions:', error);
            }
        };

        fetchCitySuggestions();
    }, [cityName, apiKey]);

    const handleCitySelect = async (selectedCity) => {
        // Fetch weather data for the selected city from the WeatherAPI
        try {
            const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${selectedCity}`;
            const response = await fetch(weatherUrl);
            const data = await response.json();
            setWeatherData(data);
            setCityName(''); // Clear the input field
            setSuggestions([]); // Clear suggestions
        } catch (error) {
            console.error('Error fetching weather data:', error);
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
                    <p>Conditions: {weatherData.current.condition.text}</p>
                </div>
            ) : (
                <p>Enter a city name to see weather information.</p>
            )}
        </div>
    );
};

export default WeatherWidget;

