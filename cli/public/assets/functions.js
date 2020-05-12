var topWeather = [];
var lastWeather = [];

/**
 * Make a request to open weather API and insert into HTML via Jquery
 */
function getWeather() {
    var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";
    var weatherLgn = "&units=metric&lang=pt";
    var weatherApi = "&APPID=" + "bced2d2f8445517b5b82cc8caae06301";
    var city = $('#city-input').val();
    
    var url = weatherUrl + city + weatherLgn + weatherApi;

    $.get(url, function (data) {
        var results = getData(data);
        $('#details').html(results);
        $('#city-input').val('');//clean input field

        w = { 'id': data.id, 'name': data.name }
        queryWeatherPost(w);
    });
}

/**
 * Returns a HTML mixed to API data to browser
 * @param data data request from the open weather API.
 */
function getData(data) {
    return '</br><h3 id="city" class="mt-2">' + data.name + ', ' + data.sys.country + '</h3>'
        + '<span id="time">' + dateFormat() + ' ' + data.weather[0].description + '</span >'
        + '<img src="http://openweathermap.org/img/w/' + data.weather[0].icon + '.png" id="icon" class="ml-5" width="70px" height="70px">'
        + '<h2 id="temp">' + Math.floor(data.main.temp * 10) / 10 + '&deg;C</h2>';
};

/**
 * Returns a resolved array with last searched weathers or rejected empty array
 * @param url formatted string for API request
 */
function getTopSearched(url) {
    return new Promise(
        (resolve, reject) => {
            $.get(url, function (data) {
                topWeather = data;
                if (data)
                    resolve(data)
                else
                    reject({})
            });
        }
    )
}

/**
 * Returns a resolved array with last searched weathers or rejected empty array
 * @param url formatted string for API request
 */
function getlastSearched(url) {
    return new Promise(
        (resolve, reject) => {
            $.get(url, function (data) {
                lastWeather = data;
                if (data)
                    resolve(data)
                else
                    reject({})
            })
        }
    )
}

/**
 * Fill both modal and cointainer for top searched weathers and last searched weathers
 * @param url obj containing URLs to API call: last searched weathers and top searched weathers, and dates of last searched weathers 
 */
async function weatherHandler(url) {
    var lastUpdate = [];
    var topList = '';
    var lastList = '';

    await getTopSearched(url.top);
    await getlastSearched(url.last);

    url.lastUpdate.forEach(element => {
        lastUpdate.push(new Date(element).getTime());
    });

    for (let i = 0; i < topWeather.list.length; i++) {
        topList += `<button type="button" class="btn btn-outline-secondary mx-1" id="${topWeather.list[i].id}">${topWeather.list[i].name}</button>`
        lastList += `<li class="list-group-item" id="${lastWeather.list[i].id}">${lastWeather.list[i].name}, ${Math.floor(lastWeather.list[i].main.temp * 10) / 10}°C ${lastWeather.list[i].weather[0].description} <small>(há ${timeSince(lastUpdate[i])})</small></li>`
    }

    $('.list-inline').html(topList);
    $('.list-group').html(lastList);

    $('.btn').click(async function () {
        var id = $(this).attr('id');
        fillModal(id)
    });
}

/**
 * Fill modal with content based on the id of a selected element on the app page 
 * @param id of the selected element to fill with content on modal 
 */
async function fillModal(id) {
    var weather;

    await topWeather.list.forEach(w => {
        if (w.id == id)
            weather = w;
    });

    $('#topcitiesLabel').text(weather.name + ", " + weather.sys.country);
    $('#feels-like').text(weather.main.feels_like);
    $('#temp-min-max').text(weather.main.temp_min + '/' + weather.main.temp_max);
    $('#modal-img').html('<img src="http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png" id="icon" class="ml-5" width="70px" height="70px">');
    $('#topcities').modal({ keyboard: true });
}

function queryWeatherPost(weather) {
    var url = 'http://localhost:4000/weather'
    $.post(url, weather, weatherHandler);
}

function queryWeatherGet() {
    var url = 'http://localhost:4000/weather'
    $.get(url, weatherHandler);
}

/**
 * Returns a formated String with current time.
 */
function dateFormat() {
    var date = new Date();
    dayName = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    var day = dayName[date.getDay()];
    var hours = date.getHours();
    var minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return day + ' ' + (hours > 18 ? hours + ':' + minutes + ' PM' : hours + ':' + minutes + ' AM');
};

/**
 * Get a date in milliseconds and returns a string with the difference when it was last query
 * @param time time in milliseconds
 */
function timeSince(time) {

    var seconds = Math.floor((new Date() - time) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval <= 1 ? interval + " ano" : interval + " anos";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval <= 1 ? interval + " mes" : interval + " meses";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval <= 1 ? interval + " dia" : interval + " dias";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval <= 1 ? interval + " hora" : interval + " horas";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval <= 1 ? interval + " minuto" : interval + " minutos";
    }
    return Math.floor(seconds) <= 1 ? Math.floor(seconds) + " segundo" : Math.floor(seconds) + " segundos";
}

$(document).ready(function () {
    queryWeatherGet();
    $('#city-input').keypress(function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            getWeather();
        }
    });
});