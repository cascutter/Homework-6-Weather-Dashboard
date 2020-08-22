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
        $(".list").append(cityListItem);
    }

    function getCurrentConditions(response) {
        var tempF = (response.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        $("#currentCity").empty();

        var card = $("<div>").addClass("card");
        var cardBody = $("<div>").addClass("card-body");
        var city = $("<h4>").addClass("card-title").text(response.name);
        var temperature = $("<p>").addClass("card-text current-temp").text("Current Temperature: " + tempF + " °F");

        card.append(cardBody);
        cardBody.append(city, temperature);
    }









})