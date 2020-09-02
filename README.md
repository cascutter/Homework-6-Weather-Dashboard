# Homework 6: Weather Dashboard

Homework 6: Weather Dashboard is a weather dashboard that uses OpenWeather API to retrieve weather data for cities. The use of a third-party API allows access to their data and functionality by making requests with specific parameters to a URL. This weather dashboard runs in the browser and features dyncamically updated HTML and CSS.

## Motivation

This project was created to show an understanding of third-party APIs to create a browser-based, interactive application. It combines knowledge of HTML, CSS, JavaScript, jQuery, moment.js, third-party APIs, and ajax.

### Example of API use
```
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
```

### Features

<img src="https://media.giphy.com/media/VJOHArg9W9UIbCzi63/giphy.gif">

* When a city is searched, user is presented with current and future conditions for that city and that city is added to the search history.

* When user views the current weather conditions for the searched city, they are presented with the city name, the date, an icon representation of the weather conditions, the temperature, the humidity, and the UV index.

* The UV index presents a color that indicates whether the conditions are favorable (green), moderate (yellow), or severe (red).

* The user is presented with a 5-day forecast which displays the date, an icon representation of the weather conditions, the temperature, and the humidity.

* When user reopens or refreshes page, last searched city is displayed in browser.

* Previously searched cities can be clicked and that city's weather data displays in browser.

## Author
* JavaScript using jQuery, HTML, and CSS by Casandra Cutter
* [OpenWeather API](https://openweathermap.org/api) was used to retrieve weather data
* H/t: GitHub; OpenWeather API; Stack Overflow; MDN Web Docs; Danielle Bowman