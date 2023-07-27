//dont look
var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';

var endpoint = 'https://api.openweathermap.org';





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
}
);
clearHistory.addEventListener('click', function(event){
    // searchHistory.innerHTML = '';
    localStorage.setItem("cities", []);
    location.reload();
}
) 


function getLocalStorage(key){
    var res = localStorage.getItem("cities") || "[]";
    var citiesArray = JSON.parse(res);
    return citiesArray
}

  
//api call function
function searchOnClick(event) {
    event.preventDefault();
    var city = searchBar.value.trim();
    searchHistoryArray = getLocalStorage("cities");
    //var searchHistoryArray = JSON.parse(localStorage.getItem("cities")) || [];
    
    //localStorage.getItem("cities") || [];
    searchHistoryArray.push(city);
    localStorage.setItem("cities", JSON.stringify(searchHistoryArray));

    getData(city, true);
}

function getData(city, newButton = false){
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
                if(newButton) saveToHistory(city)
                return fetch(`${endpoint}/data/2.5/forecast?lat=${latLong[0]}&lon=${latLong[1]}&appid=${apiKey}&units=imperial`);
            }
        })
        .then(function (response) {
            searchBar.value = "";

            return response ? response.json() : {};
        })
        .then(function(data) {
            weather.fiveday = getFiveDayForecast(data);
        })
        .then(function () {
            if (!latLong.length) return;

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
    if(!todaysData) return;

    cityDateText.textContent = `${todaysData.name} (${dayjs().format('MM/DD/YYYY')})`;
    var currentDayIcon = document.createElement("img");
    currentDayIcon.classList.add("weather-icon");
    currentDayIcon.src = `http://openweathermap.org/img/w/${todaysData.weather[0].icon}.png`;
    cityDateText.append(currentDayIcon)

    todaysTemp.textContent = `Temp: ${todaysData.main.temp}°F`;
    todaysHumidity.textContent = `Humidity: ${todaysData.main.humidity}%`;
    todaysWind.textContent = `Wind: ${todaysData.wind.speed}mph`;

}

saveToHistory();
function saveToHistory(city) {
    //var res = localStorage.getItem("cities") || "[]";
    //console.log(res)
    
    var citiesArray = getLocalStorage("cities");

    searchHistory.innerHTML = '';
  
    citiesArray.forEach((city) => {
      var historyButton = document.createElement("button");
      historyButton.classList.add("btn", "btn-light", "m-1", "col-12");
      historyButton.setAttribute("style", "max-width: 9rem;");
      historyButton.textContent = city;
  
      searchHistory.prepend(historyButton);
      historyButton.onclick = () => {
        getData(city);
      };
    });

}


function getFiveDayForecast(forecastData) {
    
    forecastSection.innerHTML = '';

    var fullForecast = forecastData.list || []
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
                //working here
                date.textContent = dayjs(dayOfWeather.date[0]).format('MM/DD/YYYY');
                date.setAttribute("style", "font-size: 20px");
            }
            else if (weatherType === "icon") {
                var condition = document.createElement("img");
                condition.classList.add("weather-icon");
                condition.src = `http://openweathermap.org/img/w/${dayOfWeather[weatherType][0]}.png`;
                forecastCard.append(condition)
            }
            else {
                var condition = document.createElement("span");
                condition.textContent = `${dayOfWeather[weatherType][1]}: ${dayOfWeather[weatherType][0]}`;
                condition.classList.add("font-weight-light");
                forecastCard.append(condition)
                condition.setAttribute("style", "font-size: 13px");
            }
        }
        forecastSection.append(forecastCard);
    }
}
