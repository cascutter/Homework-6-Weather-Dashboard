$(document).ready(function () {
    document.cookie = 'cross-site-cookie=bar; SameSite=Lax';
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
            
        })
    });

    function previousCity() {
        var cityListItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").prepend(cityListItem);
    }

    function getCurrentConditions(data) {
        var tempF = (data.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        var iconCode = data.weather[0].icon;
        var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        $(".icon").html("<img src='" + iconURL + "'>");

        var currentDate = moment().subtract(10, 'days').calendar();



        //$(".city-list").empty();

        var currentCity = $("<div>").addClass("card current-city col-lg-7");
        var cardBody = $("<div>").addClass("card-body");
        var date = $("<h5>").addClass("card-title").text(currentDate , data.name);
        var city = $("<h3>").addClass("card-title").text(data.name);
        var iconDisplay = $("<div>").addClass("icon").html("<img src='" + iconURL + "'>");
        var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + "°F");
        var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + data.main.humidity + "%");
        var windSpeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + data.wind.speed + " MPH");
        //var uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: " + data.uvindex);


        $(".row").append(currentCity);
        currentCity.append(cardBody);
        cardBody.append(city, date, iconDisplay, temperature, humidity, windSpeed);
    }









})