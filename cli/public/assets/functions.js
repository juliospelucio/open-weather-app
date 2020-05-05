/**
 * Make a request to open weather API and insert into HTML via Jquery
 */
function getWeather() {
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
    var weatherLgn = "&units=metric&lang=pt"
    var weatherApi = "&APPID=" + "bced2d2f8445517b5b82cc8caae06301";
    var city = $('#city-input').val();
    var url = weatherUrl + city + weatherLgn + weatherApi;

    $.get(url, function (data) {
        var results = getData(data);
        $('#details').html(results);
        $('#city-input').val('');//clean input field

        // console.log(data);

        w = {
            // 'main': data.weather[0].main,
            // 'description': data.weather[0].description,
            // 'icon': data.weather[0].icon,
            // 'temp': data.main.temp,
            // 'feels_like': data.main.feels_like,
            // 'temp_min': data.main.temp_min,
            // 'temp_max': data.main.temp_max,
            // 'humidity': data.main.humidity,
            // 'country': data.sys.country,
            'id': data.id,
            'name': data.name,
        }
        // console.log(w);
        checkWeather(w);
    });
};


function getTop(url) {
    $.get(url, function (data) {
        console.log(data);
    })
}

function getlastSearched(url) {
    $.get(url, function (data) {
        console.log(data);
    })
}


function weatherHandler(url) {
    getTop(url.top);
    getlastSearched(url.last)
}

function checkWeather(weather) {
    var url = 'http://localhost:4000/weather'
    $.post(url, weather, weatherHandler);
}

/**
 * Returns a HTML mixed api data to the front-end
 * @param results data request from the open weather API.
 */
function getData(data) {
    return '<h3 id="city" class="mt-2">' + data.name + ', ' + data.sys.country + '</h3>'
        + '<span id="time">' + getDate() + ' ' + data.weather[0].description + '</span >'
        + '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" id="icon" class="ml-5" width="70px" height="70px">'
        + '<h2 id="temp">' + Math.floor(data.main.temp * 10) / 10 + '&deg;C</h2>';
};

/**
 * Returns a formated String with current time.
 */
function getDate() {
    var date = new Date();
    dayName = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    var day = dayName[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return day + ' ' + (hours > 18 ? hours + ':' + minutes + ' PM' : hours + ':' + minutes + ' AM');
};

$(document).ready(function () {
    // getWeather();
    $('#city-input').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            getWeather();
        }
    });
});
