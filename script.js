$(document).ready(function () {
    // API key
    var apiKey = "&appid=6ca038ea2b4c13fe63caf34632dc9f40"

    $("#searchBtn").on("click", function (){
        $("#forecastHeader").addClass("show");
        city = $("#searchCity").val();
        $("#searchCity").val("");

        var queryUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;

        $.ajax({
            url: queryUrl,
            method: "GET"
        })
        .then(function (response){
            console.log(response)

            console.log(response.name);
            console.log(response.timezone);
            console.log(response.weather[0].icon);
            console.log(response.main.temp);
            console.log(response.main.humidity);
            console.log(response.wind.speed);

            previousCity();
            getCurrentConditions(response);
            
        })
    });

    function previousCity() {
        var cityListItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").prepend(cityListItem);
    }

    function getCurrentConditions(response) {
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        //$(".city-list").empty();

        var currentCity = $("<div>").addClass("card current-city col-lg-7");
        var cardBody = $("<div>").addClass("card-body");
        var city = $("<h5>").addClass("card-title").text(response.name);
        var icon = response.weather[0].icon;
        var iconURL = $("<img>").attr("http://openweathermap.org/img/wn/10d@2x.png" + icon + ".png");
        var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + "°F");
        var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
        var windSpeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
        //var uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: " + response.uvindex);


        $(".row").append(currentCity);
        currentCity.append(cardBody);
        cardBody.append(city, iconURL, temperature, humidity, windSpeed);
    }









})