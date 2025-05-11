// DOM Elements
const formElement = document.querySelector(".search-form");
const inputElement = document.querySelector(".city-input");
const cityElement = document.querySelector(".city");
const dateElement = document.querySelector(".date");
const descriptionIcon = document.querySelector(".description i");
const descriptionText = document.querySelector(".description-text");
const temperatureElement = document.querySelector(".temp");
const windSpeedElement = document.querySelector(".wind-speed");
const humidityElement = document.querySelector(".humidity");
const visibilityElement = document.querySelector(".visibility-distance");

// API Configuration
const apiKey = '0a5d8f891d21022af9609451d92e1b9e';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Fetches weather data from OpenWeatherMap API
 * @param {string} city - City name to search for
 * @returns {Promise<Object>} Weather data object
 */
async function fetchWeatherData(city) {
    try {
        const response = await fetch(
            `${baseUrl}?q=${city}&appid=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`City not found (${response.status})`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Weather API Error:", error);
        showError(error.message);
        return null;
    }
}

/**
 * Updates the UI with weather data
 * @param {Object} data - Weather data from API
 */
function updateWeatherUI(data) {
    if (!data) return;
    
    // Basic weather info
    cityElement.textContent = data.name || "Unknown Location";
    temperatureElement.textContent = `${Math.round(data.main.temp - 273.15)}°C`;
    windSpeedElement.textContent = `${data.wind.speed} km/h`; 
    humidityElement.textContent = `${data.main.humidity}%`;
    visibilityElement.textContent = `${data.visibility /1000} km`;
    descriptionText.textContent = capitalizeFirstLetter(data.weather[0].description);

    // Date display
    dateElement.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Weather icon
    const weatherIconName = getWeatherIconName(data.weather[0].main);
    descriptionIcon.textContent = weatherIconName;
}

/**
 * Maps weather conditions to Material Icons
 * @param {string} weatherCondition - Main weather condition from API
 * @returns {string} Material Icon name
 */
function getWeatherIconName(weatherCondition) {
    const iconMap = {
        Clear: "wb_sunny",
        Clouds: "wb_cloudy",
        Rain: "umbrella",
        Thunderstorm: "flash_on",
        Drizzle: "grain",
        Snow: "ac_unit",
        Mist: "cloud",
        Smoke: "cloud",
        Haze: "cloud",
        Fog: "cloud",
    };

    return iconMap[weatherCondition] || "help";
}

/**
 * Displays error message to user
 * @param {string} message - Error message to display
 */
function showError(message) {
    cityElement.textContent = "Error";
    descriptionText.textContent = message;
    temperatureElement.textContent = "--°C";
}

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} Capitalized string
 */
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Event Listeners
formElement.addEventListener("submit", async function (e) {
    e.preventDefault();
    
    const city = inputElement.value.trim();
    if (city) {
        const weatherData = await fetchWeatherData(city);
        if (weatherData) {
            updateWeatherUI(weatherData);
        }
        inputElement.value = "";
    }
});

// Initialize with default city
document.addEventListener('DOMContentLoaded', () => {
    fetchWeatherData("Karachi")
        .then(data => updateWeatherUI(data));
});
