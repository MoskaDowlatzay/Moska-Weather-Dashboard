    const cityInput = $(".city-input");
    const searchButton = $(".search-btn");
    const currentWeatherDiv = $(".current-weather");
    const weatherCardsDiv = $(".weather-cards");
    const API_KEY = "a934527504a2622fcdf737712d565356";

    const createWeatherCard = (cityName, weatherItem, index) => {
        if (index === 0) { // HTML for the main weather card
            return `<div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>`;
        } else { // HTML for the other five day forecast card
            return `<li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </li>`;
        }
    };
    const getWeatherDetails = (cityName, latitude, longitude) => {
        const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

        fetch(WEATHER_API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                // Filter the forecasts to get only one forecast per day
                const uniqueForecastDays = [];
                const fiveDaysForecast = data.list.filter(forecast => {
                    const forecastDate = new Date(forecast.dt_txt).getDate();
                    if (!uniqueForecastDays.includes(forecastDate)) {
                        return uniqueForecastDays.push(forecastDate);
                    }
                });

                // Clearing previous weather data
                cityInput.val("");
                currentWeatherDiv.html("");
                weatherCardsDiv.html("");

                // Creating weather cards and adding them to the DOM
                fiveDaysForecast.forEach((weatherItem, index) => {
                    const html = createWeatherCard(cityName, weatherItem, index);
                    if (index === 0) {
                        currentWeatherDiv.append(html);
                    } else {
                        weatherCardsDiv.append(html);
                    }
                });
            })
            .catch(error => {
                console.error("Error during fetch operation:", error);
                alert("An error occurred while fetching the weather forecast!");
            });
    };

    const getCityCoordinate = () => {
        const cityName = cityInput.val().trim();
        if (cityName === "") return;
        const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        // Get entered city coordinates (latitude, longitude, and name) from the API
        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (!data.length) return alert(`No coordinates found for ${cityName}`);
                const { lat, lon, name } = data[0];
                getWeatherDetails(name, lat, lon);
            })
            .catch(error => {
                console.error("Error during fetch operation:", error);
                alert("An error occurred while fetching the coordinates!");
            });
    };

    searchButton.on("click", getCityCoordinate);
    cityInput.on("keyup", e => e.key === "Enter" && getCityCoordinate());
let searchHistory = [];

    // Function to update the search history
    const updateSearchHistory = (cityName) => {
        // Add the cityName to the search history
        searchHistory.unshift(cityName);

        // Limit the search history to a certain number of items, e.g., 5
        if (searchHistory.length > 5) {
            searchHistory.pop(); // Remove the last item if it exceeds the limit
        }

        // Update the UI with the search history
        updateSearchHistoryUI();
    };

    // Function to update the search history UI
    const updateSearchHistoryUI = () => {
        const historyList = $("#searchHistoryList");
        historyList.empty();

        // Append each city to the search history list
        searchHistory.forEach((city) => {
            const listItem = $("<li>").text(city).addClass("search-history-item");
            historyList.append(listItem);

            // Add click event to each search history item
            listItem.click(() => {
                getCityCoordinates(city); // Fetch weather data for the selected city
            });
        });
    };
    // Function to get city coordinates and weather details
    const getCityCoordinates = (cityName) => {
        const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

        fetch(API_URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(data => {
                if (!data.length) return alert(`No coordinates found for ${cityName}`);
                const { lat, lon, name } = data[0];
                getWeatherDetails(name, lat, lon);
            })
            .catch(error => {
                console.error("Error during fetch operation:", error);
                alert("An error occurred while fetching the coordinates!");
            });
        };


