var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';
var endpoint = 'http://api.openweathermap.org'


var searchBar = document.querySelector('#city-searchbar');
var searchButton = document.querySelector('#city-search-submit-btn');
var forecastSection = document.querySelector('#forecast-section');

searchButton.addEventListener('click', geocode);


function geocode(event) {
    
    event.preventDefault();
    var city = searchBar.value;
    var geocodeUri = `${endpoint}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    
    var latLong = [];

    console.log(city);
    console.log(geocodeUri);
    fetch (geocodeUri) 

        .then(function (response) {
            return response.json();
        })

        .then(function(data) {

            if (data.length === 0) {
                console.log("Please enter a valid city")
                return;
            }
            else {
                console.log(data);
                latLong[0] = data[0].lat;
                latLong[1] = data[0].lon;
                console.log(latLong);
                return fetch(`${endpoint}/data/2.5/forecast?lat=${latLong[0]}&lon=${latLong[1]}&appid=${apiKey}&units=imperial`);
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            return getFiveDayForecast(data);
        })
    searchBar.value = "";
}


function getFiveDayForecast(forecastData) {
    console.log(`Weather data!!:\n${forecastData.list[0].dt}`);
    var fullForecast = forecastData.list
    var trimmedFiveDay = []
    for (let i = 0; i < fullForecast.length; i+=8) {
        const oneDay = fullForecast[i];
        dailyWeatherObj = {
            "date": oneDay.dt_txt,
            "icon": oneDay.weather[0].icon,
            "temp": oneDay.main.temp,
            "wind": oneDay.wind.speed,
            "humidity": oneDay.main.humidity
        }
        trimmedFiveDay.push(dailyWeatherObj)
    }  
    console.log(trimmedFiveDay);
    return printFiveDayForecast(trimmedFiveDay);
}

function printFiveDayForecast (forecast) {
    for (let i = 0; i < forecast.length; i++) {
        var dayOfWeather = forecast[i];
        var forecastCard = document.createElement("div")
        forecastCard.classList.add("card");

        for (const weatherType in dayOfWeather) {
            console.log(`${weatherType}: ${dayOfWeather[weatherType]}`);
            if (weatherType === "date") {
                var date = document.createElement("h3")
                forecastCard.append(date)
                date.textContent = dayOfWeather[weatherType];
            }
            else {
                var condition = document.createElement("span");
                condition.textContent = dayOfWeather[weatherType];
                forecastCard.append(condition)
            }
        }
        forecastSection.append(forecastCard);

    }
   
}
