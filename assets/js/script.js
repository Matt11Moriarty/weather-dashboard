var apiKey = 'fd5bcdf5b68d3fbf74e736379ffe6e3c';



var searchBar = document.querySelector('#city-searchbar');
var searchButton = document.querySelector('#city-search-submit-btn');


searchButton.addEventListener('click', geocode);


function geocode(event) {
    
    event.preventDefault();
    var city = searchBar.value;
    var geocodeUri = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
    var 
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
                return latLong;
            }
        })
        .then(function(coordinates) {   
            fetch()
        })
    searchBar.value = "";
    return latLong;   
}
