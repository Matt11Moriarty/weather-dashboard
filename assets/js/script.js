var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';
var endpoint = 'http://api.openweathermap.org'

function currentDate () {
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${month}/${day}/${year}`;
    return currentDate;
}




var searchBar = document.querySelector('#city-searchbar');
var searchButton = document.querySelector('#city-search-submit-btn');
var forecastSection = document.querySelector('#forecast-section');
var cityDateText = document.querySelector('#cityDate');

searchButton.addEventListener('click', function (event) {
    geocode(event);
    currentWeather(event);
}
);

function currentWeather(event) {

}

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
            console.log(weather);
            searchBar.value = "";
            return weather;
        })

    
}

function currentDay (todaysData) {
    console.log(todaysData)
    cityDateText.textContent = `${todaysData.name} (${currentDate()})`
}


function getFiveDayForecast(forecastData) {
    forecastSection.innerHTML = '';
    console.log(`Weather data!!:\n${forecastData.list[0].dt}`);
    var fullForecast = forecastData.list
    var trimmedFiveDay = []
    for (let i = 0; i < fullForecast.length; i+=8) {
        const oneDay = fullForecast[i];
        dailyWeatherObj = {
            "Date: ": oneDay.dt_txt,
            "": oneDay.weather[0].icon,
            "Temp: ": oneDay.main.temp,
            "Wind: ": oneDay.wind.speed,
            "Humidity: ": oneDay.main.humidity
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
            if (weatherType === "Date: ") {
                var date = document.createElement("h6")
                forecastCard.append(date)
                date.textContent = dayOfWeather[weatherType];
            }
            else {
                var condition = document.createElement("span");
                condition.textContent = `${weatherType}${dayOfWeather[weatherType]}`;
                condition.classList.add("font-weight-light");
                forecastCard.append(condition)
            }
        }
        forecastSection.append(forecastCard);

    }
   
}
