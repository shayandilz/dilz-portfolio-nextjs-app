// WeatherWidget.js
import React, { useEffect, useState } from 'react';

const WeatherWidget = () => {
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        // Check if the Geolocation API is available in the browser
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                // Replace 'YOUR_WEATHERAPI_KEY' with your actual WeatherAPI key
                const apiKey = '424e382e7ed347fe86484215231109';
                const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`;

                try {
                    const response = await fetch(apiUrl);
                    const data = await response.json();
                    console.log(data)
                    setWeatherData(data);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            });
        }
    }, []);

    return (
        <div className="weather-widget">
            {weatherData ? (
                <div>
                    <h3>Current Weather</h3>
                    <p>Location: {weatherData.location.name}, {weatherData.location.country}</p>
                    <p>Temperature: {weatherData.current.temp_c}°C</p>
                    <p>Conditions: {weatherData.current.condition.text}</p>
                </div>
            ) : (
                <p>Loading weather data...</p>
            )}
        </div>
    );
};

export default WeatherWidget;
