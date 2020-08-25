$(document).ready(function () {

    // Stops cross-site cookie alert in console
    document.cookie = 'cross-site-cookie=bar; SameSite=Lax';

    // API key
    let apiKey = "&appid=6ca038ea2b4c13fe63caf34632dc9f40"

    // Function for search bar
    $("#searchBtn").on("click", function (){
        $("#forecastHeader").addClass("show");
        city = $("#searchCity").val();
        $("#searchCity").val("");

        // Variable for current city data 
        let queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
        
        // API call for current city data
        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function (data){
            console.log(data)

            console.log(data.name);
            console.log(data.timezone);
            console.log(data.weather[0].icon);
            console.log(data.main.temp);
            console.log(data.main.humidity);
            console.log(data.wind.speed);

            previousCity();
            getCurrentConditions(data);
            
        });

        // let uviQueryURL = "http://api.openweathermap.org/data/2.5/uvi?appid={&appid=6ca038ea2b4c13fe63caf34632dc9f40}&lat={lat}&lon={lon}";
        // //let lat = data.city.coord.lat;
        // //let lon = data.city.coord.lon;

        // $.ajax({
        //     url: uviQueryURL,
        //     method: "GET"
        // })
        // .then(function (data){
        //     let uvIndex = data.value;
            
        //     previousCity();
        //     getCurrentConditions(data);
            
        //     console.log(uvIndex);
        // })
    });

    // Adds previously searched cities to search bar card
    function previousCity() {
        const cityListItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").prepend(cityListItem);
    }
    
    // Gets current conditions from city search
    function getCurrentConditions(data) {

        // Translates temp from kevlin to farhenheit
        const tempF = (data.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        // Uses moment.js to get current date
        let currentDate = moment().subtract(10, 'days').calendar();

        // API call for weather icons
        let iconCode = data.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        $(".icon").html("<img src='" + iconURL + "'>");

        // Empty card 
        $(".current-city").empty();

        // Establishing variables for data from api call and card
        let currentCityCard = $("<div>").addClass("card");
        let cardBody = $("<div>").addClass("card-body");
        let date = $("<h5>").addClass("card-title").text(currentDate , data.name);
        let city = $("<h3>").addClass("card-title").text(data.name);
        let iconDisplay = $("<div>").addClass("icon").html("<img src='" + iconURL + "'>");
        let temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + "°F");
        let humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + data.main.humidity + "%");
        let windSpeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + data.wind.speed + " MPH");
        //let uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: " + data.uvindex);

        // Append data to current city card
        city.append(date, iconDisplay);
        cardBody.append(city, temperature, humidity, windSpeed);
        currentCityCard.append(cardBody);
        $(".current-city").append(currentCityCard);
    }

    









})