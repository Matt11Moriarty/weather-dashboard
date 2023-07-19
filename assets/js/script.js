var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';
var endpoint = 'http://api.openweathermap.org'


var searchBar = document.querySelector('#city-searchbar');
var searchButton = document.querySelector('#city-search-submit-btn');


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
                return fetch(`${endpoint}/data/2.5/forecast?lat=${latLong[0]}&lon=${latLong[1]}&appid=${apiKey}&units=imperial&cnt=3`);
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function(data) {
            console.log(`Weather data:\n${data}`);
            
        })

    searchBar.value = "";
    return latLong;   
}
