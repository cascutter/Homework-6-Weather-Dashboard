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
            getForecast(data)
            //getUvIndex(data);
            
        });
       
    });

    // Adds previously searched cities to search bar card
    function previousCity() {
        let cityListItem = $("<li>").addClass("list-group-item").text(city);
        $(".list").prepend(cityListItem);
    }

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
            let uvValue = $("<span>").text(data.value);
            // Update class and add if statements to change background color of button
            $("#current-city .card-body").append(uvIndex.append(uvValue));        
        })

    }
    
    // Gets current conditions from city search
    function getCurrentConditions(data) {

        getUvIndex(data);
        //console.log(uvData);

        // Calculates temp from kevlin to farhenheit
        let tempF = (data.main.temp - 273.15) * 1.80 + 32;
        tempF = Math.floor(tempF);

        // Uses moment.js to get current date
        let currentDate = moment().subtract(10, 'days').calendar();

        // Get weather icons
        let iconCode = data.weather[0].icon;
        let iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
        $(".icon").html("<img src='" + iconURL + "'>");

        // Empty card 
        $("#current-city").empty();

        // Establishing variables for data from api call and card
        let currentCityCard = $("<div>").addClass("card");
        let cardBody = $("<div>").addClass("card-body");
        let date = $("<h5>").addClass("card-title").text(currentDate , data.name);
        let city = $("<h3>").addClass("card-title").text(data.name);
        let iconDisplay = $("<div>").addClass("icon").html("<img src='" + iconURL + "'>");
        let temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + "°F");
        let humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + data.main.humidity + "%");
        let windSpeed = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + data.wind.speed + " MPH");
        //let uvIndex = $("<p>").addClass("card-text current-uv").text("UV Index: " + data.value);

        // Append data to current city card
        city.append(date, iconDisplay);
        cardBody.append(city, temperature, humidity, windSpeed);
        currentCityCard.append(cardBody);
        $("#current-city").append(currentCityCard);
    }

    $(function() {
        loadData();
            function loadData() {
                $("#current-city").val(localStorage.getItem("card-text"));
            }
        $("#searchBtn").click(function() {
            let currentData = $(this).siblings("card-text").val("");
            let cardData = $(this).siblings("card-text").attr("id");
            localStorage.setItem(cardData, currentData);
        })
    })

    function getForecast () {
  
        $.ajax({
          url: "https://api.openweathermap.org/data/2.5/forecast?q=" + city + apiKey,
          method: "GET"
        }).then(function (data){
          $('#forecast').empty();
          console.log(data);
      
          let results = data.list;
    
          for (let i = 0; i < results.length; i++) {
            console.log(results[i].dt_txt)
            let day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
            let hour = results[i].dt_txt.split('-')[2].split(' ')[1];
            console.log(day);
            console.log(hour);
      
            if(results[i].dt_txt.indexOf("12:00:00") !== -1){
              
              // get the temperature and convert to fahrenheit 
              let temp = (results[i].main.temp - 273.15) * 1.80 + 32;
              let tempF = Math.floor(temp);
      
              let forecastCard = $("<div>").addClass("card col-md-2 ml-3 bg-primary text-white");
              let forecastCardBody = $("<div>").addClass("card-body p-3 forecastBody")
              let forecastDate = $("<h4>").addClass("card-title").text(day);
              let forecastTemp = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
              let forecastHumidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
      
              //let image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")
      
              forecastCardBody.append(forecastDate, forecastTemp, forecastHumidity);
              forecastCard.append(forecastCardBody);
              $("#forecast").append(forecastCard);
      
            }
          }
        });
    }


})