// API Key: 0840207763b3bb99dc2cce93ddb094d0

//function for second to fifth days
/**
 * 
 * @param {i} iValue index number in array
 * @param {*} dayOfWeek div for the weekday
 * @param {*} obj will automatically refer to the obj declared at top of for loop
 */
function nextWeather (dataOfTheDay, extendedInfos = false){
    let dayOfWeek = document.createElement('div');
    if(extendedInfos) {
        dayOfWeek.id= 'upper';
        // city
        let city = document.createElement('h2');
        city.textContent = dataOfTheDay.city;
        dayOfWeek.appendChild(city);
    }else {
        dayOfWeek.className = 'otherdays';
    }
    
    // weekday
    let date = new Date(dataOfTheDay.dt_txt); // new Date () :constructor to build a new Date object
    var options = {weekday: 'long'};
    let weekday = document.createElement('div');
    weekday.textContent = new Intl.DateTimeFormat('en-US', options).format(date);

    // icon
    let icon = dataOfTheDay.weather[0].icon; //icon ID
    let iconDiv = document.createElement('div');
    let iconImg = document.createElement('img'); //icon img element
    iconImg.src = `http://openweathermap.org/img/wn/${icon}@2x.png`;
    iconDiv.appendChild(iconImg);

    // temperature
    let temperature = document.createElement('div');
    temperature.textContent = dataOfTheDay.main.temp + ' °C';
    
    // weather
    let weather = document.createElement('div');
    weather.textContent = dataOfTheDay.weather[0].description;

    // append to respective divs
    dayOfWeek.appendChild(weekday);
    dayOfWeek.appendChild(iconDiv);
    dayOfWeek.appendChild(temperature);
    dayOfWeek.appendChild(weather);

    if(extendedInfos){
        let windspeed = document.createElement('div');
        windspeed.textContent = 'wind: ' + dataOfTheDay.wind.speed + ' m/s';
        let pressure = document.createElement('div');
        pressure.textContent = 'pressure: ' + dataOfTheDay.main.pressure + ' hPa';
        let humidity = document.createElement('div');
        humidity.textContent = 'humidity: ' + dataOfTheDay.main.humidity + '%';
        let cloudiness = document.createElement('div');
        cloudiness.textContent = 'cloudiness: ' + dataOfTheDay.clouds.all + '%';
        
        // append to div 'today'
        
        dayOfWeek.appendChild(windspeed);
        dayOfWeek.appendChild(pressure);
        dayOfWeek.appendChild(humidity);
        dayOfWeek.appendChild(cloudiness);
    }
    return dayOfWeek;
}

function loadCityInfos(cityValue) {
    let weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = "";

    var xhr = new XMLHttpRequest ();
    var myURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=0840207763b3bb99dc2cce93ddb094d0&units=metric`;
    xhr.open('GET', myURL);
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // if the file is loaded without error
            let obj = JSON.parse(xhr.responseText); // Declare JSON Object
            //LOWER
            let lowerDiv = document.createElement('div');
            lowerDiv.id = 'bottom';
            for(i=0; i<obj.list.length; i+=8) {
                if(i==0){
                    let objCity = Object.assign(obj.list[i], {city: obj.city.name})
                    let today = nextWeather(objCity,true);
                    weatherResult.appendChild(today);
                }else{
                    lowerDiv.appendChild(nextWeather(obj.list[i]));
                }
            }
            weatherResult.appendChild(lowerDiv);
        } else if (xhr.status != 200) { // in case of error
            weatherResult.textContent = xhr.status + ' - ' + xhr.statusText;
        }
    })
    xhr.send(null);
}

var cityInput = document.getElementById('cityInput');
cityInput.addEventListener('keyup', function(e) {
    if(e.key === 'Enter'){
        loadCityInfos(e.target.value);
    }
});