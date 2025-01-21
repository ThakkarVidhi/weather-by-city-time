document.getElementById("weatherForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const cityInput = document.getElementById("cityInput");
    const weatherDetails = document.getElementById("weatherDetails");
    const noData = document.getElementById("noData");
    const errorDiv = document.getElementById("error");

    const cityName = cityInput.value.trim();
    if (!cityName) {
        errorDiv.textContent = "City name cannot be empty.";
        errorDiv.classList.remove("d-none");
        weatherDetails.classList.add("d-none");
        noData.classList.add("d-none");
        return;
    }

    // Clear previous messages and results
    errorDiv.textContent = "";
    errorDiv.classList.add("d-none");
    weatherDetails.classList.add("d-none");
    noData.classList.add("d-none");

    try {
        const response = await fetch("/weather", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({ cityName }),
        });

        const responseData = await response.json();

        if (!response.ok) {
            // Display error message from the server
            errorDiv.textContent = responseData.error || "An unexpected error occurred.";
            errorDiv.classList.remove("d-none");
            return;
        }

        // Display weather details
        displayWeather(responseData.data);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        errorDiv.textContent = "An error occurred. Please try again.";
        errorDiv.classList.remove("d-none");
    }
});

function displayWeather(weatherData) {
    const weatherDetails = document.getElementById("weatherDetails");
    const cityName = document.getElementById("cityName");
    const timestamp = document.getElementById("timestamp");
    const weatherIcon = document.getElementById("weatherIcon");
    const weatherDescription = document.getElementById("weatherDescription");
    const temperature = document.getElementById("temperature");
    const feelsLike = document.getElementById("feelsLike");
    const pressure = document.getElementById("pressure");
    const humidity = document.getElementById("humidity");
    const visibility = document.getElementById("visibility");
    const wind = document.getElementById("wind");
    const sunrise = document.getElementById("sunrise");
    const sunset = document.getElementById("sunset");

    // Convert and display the city local time, sunrise, and sunset times
    const cityLocalTime = convertToLocalTime(weatherData.dt, weatherData.timezone);
    const sunriseTime = convertToLocalTime(weatherData.sys.sunrise, weatherData.timezone);
    const sunsetTime = convertToLocalTime(weatherData.sys.sunset, weatherData.timezone);

    // Update the city name and other weather details
    cityName.textContent = `${weatherData.name}, ${weatherData.sys.country}`;
    timestamp.textContent = `As of ${formatTime(cityLocalTime)}`; // Local city time
    weatherIcon.src = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
    weatherDescription.textContent = weatherData.weather[0].description.charAt(0).toUpperCase() + weatherData.weather[0].description.slice(1);
    temperature.textContent = `${Math.round(weatherData.main.temp)}°C`;
    feelsLike.textContent = `${Math.round(weatherData.main.feels_like)}°C`;
    pressure.textContent = `${weatherData.main.pressure} hPa`;
    humidity.textContent = `${weatherData.main.humidity}%`;
    visibility.textContent = `${(weatherData.visibility / 1000).toFixed(1)} km`;
    wind.textContent = `${weatherData.wind.speed} m/s at ${weatherData.wind.deg}°`;

    // Update sunrise and sunset times
    sunrise.textContent = formatTime(sunriseTime); // Local sunrise time
    sunset.textContent = formatTime(sunsetTime); // Local sunset time

    // Display the weather details
    weatherDetails.classList.remove("d-none");
}

const convertToLocalTime = (timestamp, timezoneOffset) => {
    // Convert to milliseconds and adjust for the API-provided timezone offset
    return luxon.DateTime.fromSeconds(timestamp).setZone(`UTC`).plus({ seconds: timezoneOffset });
};

const formatTime = (dateTime) => {
    // Format the time with seconds and clean timezone abbreviation
    const time = dateTime.toLocaleString(luxon.DateTime.TIME_WITH_SECONDS);
    const timeZoneAbbreviation = dateTime.offsetNameShort.replace("UTC", "").trim();
    return `${time} ${timeZoneAbbreviation}`;
};
