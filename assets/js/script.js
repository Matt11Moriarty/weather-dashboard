var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';
var endpoint = 'http://api.openweathermap.org'





//query selectors
var searchBar = document.querySelector('#city-searchbar');
var searchButton = document.querySelector('#city-search-submit-btn');
var forecastSection = document.querySelector('#forecast-section');
var cityDateText = document.querySelector('#cityDate');
var todaysTemp = document.querySelector("#todayTemp")
var todaysWind = document.querySelector("#todayWind");
var todaysHumidity = document.querySelector("#todayHum");

//event listeners
searchButton.addEventListener('click', function (event) {
    geocode(event);
}
);


//utility functions
function currentDate () {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${month}/${day}/${year}`;
    return currentDate;
}

  
//api call functions
function geocode(event) {
    
    event.preventDefault();
    var city = searchBar.value;
    var geocodeUri = `${endpoint}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    var latLong = [];
    var weather = {};
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
            weather.fiveday = getFiveDayForecast(data);
        })
        .then(function () {
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latLong[0]}&lon=${latLong[1]}&units=imperial&appid=${apiKey}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                weather.today = currentDay(data)
            })
    searchBar.value = "";
    return weather;
        })

    
}


//display functions
function currentDay (todaysData) {
    console.log(todaysData)
    cityDateText.textContent = `${todaysData.name} (${currentDate()})`
    todaysTemp.textContent = `Temp: ${todaysData.main.temp}°F`;
    todaysHumidity.textContent = `Humidity: ${todaysData.main.humidity}%`;
    todaysWind.textContent = `Wind: ${todaysData.wind.speed}mph`;

}


function getFiveDayForecast(forecastData) {
    forecastSection.innerHTML = '';
    console.log(`Weather data!!:\n${forecastData.list[0].dt}`);
    var fullForecast = forecastData.list
    var trimmedFiveDay = []
    for (let i = 0; i < fullForecast.length; i+=8) {
        const oneDay = fullForecast[i];
        dailyWeatherObj = {
            "date": [oneDay.dt_txt, "Date"],
            "icon": [oneDay.weather[0].icon, ""],
            "temp": [oneDay.main.temp, "Temp"],
            "wind": [oneDay.wind.speed, "Wind"],
            "humidity": [oneDay.main.humidity, "Humidity"],
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

        forecastCard.classList.add("card", "col-12", "col-lg-2", "text-light", "bg-dark", "mb-2", "mx-2");

        for (const weatherType in dayOfWeather) {
            console.log(`${weatherType}: ${dayOfWeather[weatherType]}`);
            if (weatherType === "date") {
                var date = document.createElement("h6")
                forecastCard.append(date)
                date.textContent = currentDate();
            }
            else if (weatherType === "icon") {
                var condition = document.createElement("span");
                condition.textContent = `${dayOfWeather[weatherType][0]}`;
                condition.classList.add("font-weight-light");
                forecastCard.append(condition)
            }
            else {
                var condition = document.createElement("span");
                condition.textContent = `${dayOfWeather[weatherType][1]}: ${dayOfWeather[weatherType][0]}`;
                condition.classList.add("font-weight-light");
                forecastCard.append(condition)
            }
        }
        forecastSection.append(forecastCard);
    }
}
