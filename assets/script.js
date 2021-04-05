// Variables declared
var searchEl = document.querySelector("#search");
var cityEl = document.querySelector("#city");
var divEl = document.querySelector(".buttonAppend");
var localIndex = 0; 

// Function weather data
function history(event){
    event.preventDefault();
    var cityName = cityEl.value;
    cityEl.value = "";
    // Url for current weather data
    var currentUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&APPID=d34fae866484e6c9a70d899e387126e7&units=imperial";

    // Url for five day forecast data
    var fivedayUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&APPID=d34fae866484e6c9a70d899e387126e7&units=imperial";
    
    if (cityName == ""){
        alert("Please enter a city name!");
    } else{

        // Fetching data using url
        fetch(currentUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) { 

                // Storing city names to local storage  
                var local = localStorage.setItem(localIndex, data.name);
                localIndex++; 
                console.log(data);     
                var buttonEl = document.createElement('button');
                buttonEl.textContent = data.name;
                buttonEl.setAttribute('class','cityButtonEl');
                buttonEl.setAttribute('value',data.name);
                divEl.appendChild(buttonEl);

                // Setting date
                var today = moment().format("MM/DD/YYYY");
                var currentData = $('.currentTemp');
                currentData.css({"padding-bottom":"15px", "border": "1px solid rgb(181, 185, 185" });
                // Clearing previous data
                currentData.empty();
                // Creating h2 element for appending 
                var currentHEl = $('<h2>');
                currentHEl.css({"font-size":"2em"});              
                currentHEl.text(data.name + " (" + today + ")");
                // Appending h2 element
                currentData.append(currentHEl);
                // Icon representing weather condition
                currentData.append(`<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`);
                // Temperature data
                currentData.append("<p>" + "Temperature: " + Math.floor(data.main.temp) + " \u00B0F");
                // Humidity data
                currentData.append("<p>" + "Humidity: " + data.main.humidity + "%" + "</p>");
                // Wind speed data
                currentData.append("<p>" + "Wind Speed: " + Math.floor(data.wind.speed) + " MPH" + "</p>");
                
                // Url for UV index data
                var uvUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=d34fae866484e6c9a70d899e387126e7&lat=${data.coord.lat}&lon=${data.coord.lon}`;
                fetch(uvUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {                          
                        var uvEl = $('<p>')
                        uvEl.css({"display":"inline"});
                        uvEl.text("UV Index: ");
                        currentData.append(uvEl);
                        var colorPEl = $('<p>');                        
                        
                        // Color coding UV Index
                        if (data.value < 3){
                            colorPEl.css({"background-color":"green", "color":"white","display":"inline","padding":"5px"});                            

                        } else if (data.value <6) {
                            colorPEl.css({"background-color":"rgb(245, 245, 94)", "color":"black","display":"inline", "padding":"5px"});

                        } else if (data.value <8) {
                            colorPEl.css({"background-color":"orange", "color":"black","display":"inline","padding":"5px"});

                        } else if (data.value <11) {
                            colorPEl.css({"background-color":"red", "color":"white","display":"inline","padding":"5px"});

                        } else{
                            colorPEl.css({"background-color":"purple", "color":"white","display":"inline","padding":"5px"});

                        }
                        colorPEl.text(data.value);
                        currentData.append(colorPEl);
                    });  
            });
                // Fetching five day forecast data            
                fetch(fivedayUrl)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (data) {  
                        console.log(data);
                        var fiveDayCard = $(".fiveDayCard");
                        var fiveDate = [7, 15, 23, 31, 39];
                        var forecastDay = $(".fiveDay");
                        fiveDayCard.empty();
                        fiveDayCard.append("<h2>" + "5-Day Forecast:" + "</h2>");
                        forecastDay.empty();
                        fiveDate.forEach(function(i){
                            var nextDay = moment.unix(data.list[i].dt).format("MM/DD/YYYY"); 
                            // Fiveday forecast data display                               
                            fiveDayCard.append("<div class=fiveDayStyle>" + "<p>" + nextDay + "</p>" + `<img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png">` + "<p>" + "Temp: " + Math.floor(data.list[i].main.temp) + " \u00B0F" + "</p>" + "<p>" + "Humidity: " + data.list[i].main.humidity + "%" + "</p>" + "</div>");        
                        })
                    });
    }
}

// Function for search button clicked
searchEl.addEventListener("click", history);
