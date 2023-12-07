const WEATHER_API_KEY = '7a5d8a3abed5ab7be5ea9c7c72383be0'
var searchInput = document.getElementById("search-input");
var locationCity = document.getElementById("location-name");
var locationPlace = document.getElementsByClassName("location-place");
var temp = document.getElementById("temp");
var wind = document.getElementById("wind");
var humidity = document.getElementById("humidity");
var cardContainer = document.querySelectorAll(".card-container");
var pastSearch = document.getElementById('past-search');

const savedCities = localStorage.getItem('cities') ? JSON.parse(localStorage.getItem('cities')) : []

for(var i = 0; i < savedCities.length; i++ ){
    const searchButton = document.createElement('button');
    searchButton.innerText = savedCities[i];
    pastSearch.appendChild(searchButton);
}

pastSearch.addEventListener('click', (e) => {
    const target = e.target;
    if(target.tagName === 'BUTTON'){
        var cityName = target.textContent;
        weatherInfo('', cityName);
        locationCity.textContent = cityName;
    }
})

function weatherInfo(e, searchedCity) {
    var currentDay = 0;
    if(e)e.preventDefault();
    
    console.log(searchInput.value);


    if (searchInput.value === '') {

    } else {

        const isCurrentCitySaved = savedCities.includes(searchedCity);

        if(!isCurrentCitySaved){
            savedCities.push(searchedCity);
            localStorage.setItem('cities', JSON.stringify(savedCities));
        }

        var apiArea = 'http://api.openweathermap.org/geo/1.0/direct?q=' + searchedCity + '&limit=5&appid=' + WEATHER_API_KEY;

        fetch(apiArea)
        .then(function (response) {
            return response.json();
            console.log('no');
        })
        .then(function (data) {

            console.log(data);
            var lat = data[0].lat;
            var lon = data[0].lon;
            var apiWeather = 'http://api.openweathermap.org/data/2.5/forecast?lat=' +  lat + '&lon=' + lon + '&appid=' + WEATHER_API_KEY;
            fetch(apiWeather)
                    .then(function (result) {
                       return result.json();
                    })
                    .then(function (data) {
                        console.log(data);
                        temp.textContent = 'Temp: ' + data.list[0].main.temp;
                        wind.textContent = 'Wind: ' + data.list[0].wind.speed;
                        humidity.textContent = 'Humidity: ' + data.list[0].main.humidity;

                        for (i=0; i < cardContainer.length; i++) {
                            // console.log(cardContainer[i].children[0]);
                            var days = i + 1
                            cardContainer[i].children[0].textContent = 'Day ' + days;
                            cardContainer[i].children[1].textContent = 'Temp: ' + data.list[currentDay].main.temp;
                            cardContainer[i].children[2].textContent = 'Wind: ' + data.list[currentDay].wind.speed;
                            cardContainer[i].children[3].textContent = 'Humidity: ' + data.list[currentDay].main.humidity;

                        
                            currentDay += 8;
                        }

                    })
        });
    }
}



document.querySelector('form.search-form').addEventListener('submit', (e) =>  {
    locationCity.textContent = searchInput.value.toLowerCase();
    weatherInfo(e, searchInput.value.toLowerCase())
});