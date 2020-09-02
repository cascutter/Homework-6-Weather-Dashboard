$(document).ready(function () {

    // Stops cross-site cookie alert in console
    document.cookie = "cross-site-cookie=bar; SameSite=Lax";

    // API key
    let apiKey = "&appid=6ca038ea2b4c13fe63caf34632dc9f40"

    $("#searchBtn").on("click", function () {
        city = $("#searchCity").val();
        searchCity(city);
    })

    // Stores previous city to local storage (worked on this with tutor after homework was turned in)
    let oldCity = localStorage.getItem("city") || "";
    console.log(oldCity);
    if (oldCity.length > 0) {
        searchCity(oldCity);
    }

    // Function for search bar
    function searchCity(city) {
        $("#forecastHeader").addClass("show");
        $("#searchCity").val("");

        // Variable for current city data 
        let queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + apiKey;
        
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

            previousCity(city);
            getCurrentConditions(data);
            getForecast(city, data);   
        });    
    };

    // Previous city list functionality (worked on this with tutor after homework was turned in)
    function previousCity(city) {
       
        var history = JSON.parse(localStorage.getItem("history")) || [];

        if (history.indexOf(city) === -1) {
            history.push(city);
            window.localStorage.setItem("history", JSON.stringify(history));
            // Adds previously searched cities to search bar card 
            let cityListItem = $("<li>").addClass("list-group-item").text(city);
            $(".list").prepend(cityListItem);
            
        }
    }

    $(".list").on("click", "li", function () {
        //console.log()
        searchCity($(this).text());
    })

    // Get UV Index
    function getUvIndex(data) {
        let lat = data.coord.lat;
        let lon = data.coord.lon;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/uvi?" + apiKey + "&lat=" + lat + "&lon=" + lon,
            method: "GET"
        })
        .then (function (data){

            console.log(data);
            console.log(data.value);

            $(".current-uv").empty();
            
            let uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: ");
            let uvValue = $("<span>").text(data.value).addClass("uv-color");

            // Changes color of UV Index based on value to indicate low, moderate, high risk
                if (data.value <= 5) {
                    $(uvValue).addClass("greenColor");
                } else if (data.value <= 8) {
                    $(uvValue).addClass("yellowColor");
                } else {
                    $(uvValue).addClass("redColor");
                };
            $("#current-city .card-body").append(uvIndex.append(uvValue));       
        })

    }
    // Gets current conditions from city search
    function getCurrentConditions(data) {

        // Calls function for UV Index
        getUvIndex(data);

        // Calculates temp from kelvin to farhenheit
        let tempF = (data.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        // Get weather icons
        let iconCode = data.weather[0].icon;
        let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
        $(".icon").html("<img src='" + iconURL + "'>");

        // Empty card 
        $("#current-city").empty();

        // Establishing variables for data from api call and card
        let currentCityCard = $("<div>").addClass("card");
        let cardBody = $("<div>").addClass("card-body");
        let date = $("<h5>").addClass("card-title").text(moment().format("L"));
        let city = $("<h3>").addClass("card-title").text(data.name);
        let iconDisplay = $("<div>").addClass("icon").html("<img src='" + iconURL + "'>");
        let temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + "°F");
        let humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + data.main.humidity + "%");
        let windSpeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + data.wind.speed + " MPH");
        // Append data to current city card
        city.append(date, iconDisplay);
        cardBody.append(city, temperature, humidity, windSpeed);
        currentCityCard.append(cardBody);
        $("#current-city").append(currentCityCard);
        
         localStorage.setItem("city", data.name);
    }

    // Gets 5 day forecast from city search
    function getForecast(city) {
  
        $.ajax({
          url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
          method: "GET"
        }).then(function (data){
            $("#forecast").empty();
      
            let results = data.list;
            
            // For loop to gather 5 day data
            for (let i = 0; i < results.length; i++) {
                let day = results[i].dt_txt.split(" ")[0];

                if(results[i].dt_txt.indexOf("0:00:00") !== -1){
              
                    // Convert temperature from kelvin to fahrenheit
                    let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
                    let tempF = Math.floor(temp);
                    
                    // Establish variables from api call and cards
                    let forecastCard = $("<div>").addClass("card col-md-2 ml-2 bg-primary text-white");
                    let forecastCardBody = $("<div>").addClass("card-body p-4 forecastBody");
                    let forecastDate = $("<h6>").addClass("card-title").text(moment(day).format('l'));
                    let forecastIcon = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
                    let forecastTemp = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempF + "°F");
                    let forecastHumidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
      
                    // Append data to forecast cards
                    forecastCardBody.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
                    forecastCard.append(forecastCardBody);
                    $("#forecast").append(forecastCard);
                }
            }
        });
    }
})
