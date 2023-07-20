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
var searchHistory = document.querySelector('#search-history');
var clearHistory = document.querySelector('#clear-history');

//event listeners
searchButton.addEventListener('click', function (event) {
    searchOnClick(event);
    saveToHistory(event);
}
);
clearHistory.addEventListener('click', function(event){
    searchHistory.innerHTML = '';
}
) 


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

  
//api call function
function searchOnClick(event) {
    event.preventDefault();
    var city = searchBar.value;
    getData(city);
}

function getData(city){
    var geocodeUri = `${endpoint}/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
    
    var latLong = [];
    var weather = {};

    fetch (geocodeUri) 

        .then(function (response) {
            return response.json();
        })

        .then(function(data) {

            if (data.length === 0) {
                alert("Enter a valid city or else 🔪")
                return;
            }
            else {
                latLong[0] = data[0].lat;
                latLong[1] = data[0].lon;

                return fetch(`${endpoint}/data/2.5/forecast?lat=${latLong[0]}&lon=${latLong[1]}&appid=${apiKey}&units=imperial`);
            }
        })
        .then(function (response) {
            searchBar.value = "";

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
    
    return weather;
    }
)
}


//display functions
function currentDay (todaysData) {

    cityDateText.textContent = `${todaysData.name} (${currentDate()})`
    todaysTemp.textContent = `Temp: ${todaysData.main.temp}°F`;
    todaysHumidity.textContent = `Humidity: ${todaysData.main.humidity}%`;
    todaysWind.textContent = `Wind: ${todaysData.wind.speed}mph`;

}

function test() {
    console.log("it works!!");
}
function saveToHistory(event) {
    var historyButton = document.createElement("button")
    historyButton.classList.add("btn", "btn-light", "m-1", "col-12")
    historyButton.setAttribute("style", "max-width: 9rem;")
    historyButton.textContent = searchBar.value;
    

    searchHistory.prepend(historyButton);
    historyButton.onclick = () => {getData(historyButton.textContent)};
}


function getFiveDayForecast(forecastData) {
    forecastSection.innerHTML = '';

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
    return printFiveDayForecast(trimmedFiveDay);
}

function printFiveDayForecast (forecast) {
    for (let i = 0; i < forecast.length; i++) {
        var dayOfWeather = forecast[i];
        var forecastCard = document.createElement("div")

        forecastCard.classList.add("card", "col-10", "col-lg-2", "text-light", "bg-dark", "mb-2", "mx-2");

        for (const weatherType in dayOfWeather) {
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
