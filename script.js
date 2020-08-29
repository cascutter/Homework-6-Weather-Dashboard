$(document).ready(function () {

    // Stops cross-site cookie alert in console
    document.cookie = "cross-site-cookie=bar; SameSite=Lax";

    // API key
    let apiKey = "&appid=6ca038ea2b4c13fe63caf34632dc9f40"

    // Function for search bar
    $("#searchBtn").on("click", function (){
        $("#forecastHeader").addClass("show");
        city = $("#searchCity").val();
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

            previousCity();
            getCurrentConditions(data);
            getForecast(data);
            
            // Click event to regenerate data using previous city list data
            // Only brings in new uv index? Could not get to work properly
            $("li").on("click", function () {
                getCurrentConditions(data);
                getForecast(data);
    
            })
        });
       
    });

    // Adds previously searched cities to search bar card
    function previousCity() {
        let cityListItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").prepend(cityListItem);
    }

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

            // Saves to localstorage, but could not get to persist on page
            localStorage.setItem("uvIndex", JSON.stringify(data.value));
            localStorage.getItem(data.value);
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
        let iconURL = "http://openweathermap.org/img/w/" + iconCode + ".png";
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
        
        // Saves to localstorage, but could not get to persist on page
        localStorage.setItem("current", JSON.stringify(data));
        localStorage.getItem(data);
    }

    // Gets 5 day forecast from city search
    function getForecast () {
  
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
                    let forecastIcon = $("<img>").attr("src", "http://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
                    let forecastTemp = $("<p>").addClass("card-text forecastTemp").text("Temp: " + tempF + "°F");
                    let forecastHumidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
      
                    // Append data to forecast cards
                    forecastCardBody.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
                    forecastCard.append(forecastCardBody);
                    $("#forecast").append(forecastCard);

                    // Saves to localstorage, but could not get to persist on page
                    localStorage.setItem("forecast", JSON.stringify(data.list));
                    localStorage.getItem(data);
                    
                }
            }
        });
    }
})
