let cityInput = document.getElementById('cityInput');
let dropdown = document.getElementById('dropdown');
let divs = dropdown.children; //array of my results
let divSelected = -1; //setting the input "index" position as -1

// Fetch JSON file + create array with 10 matching cities
function getCityID(inCity) {
    
    const cityList = fetch("http://localhost/weather_camila/city.list.min.json");
    cityList.then(response => response.json())
    .then(cities => {
        const rgx = new RegExp(`^${inCity}`, 'gi');
        let matchingCities = [];
        
        cities.forEach(function(city){
            if(rgx.test(city.name) && matchingCities.length < 10) {
                matchingCities.push(city);
            }
        });

        showCityList(matchingCities);

    });
}

// Display results
function showCityList(matchingCities) {
    dropdown.style.display = matchingCities.length ? 'block' : 'none';
    
    if(matchingCities.length){
        dropdown.innerHTML= "";

        for(let i=0; i<matchingCities.length; i++){
            let outputCity = document.createElement('div');
            outputCity.className = "results";
            outputCity.textContent = matchingCities[i].name + ' - ' + matchingCities[i].country;
            
            dropdown.appendChild(outputCity);

            // mouse hover event
            outputCity.addEventListener('mouseover', function(e){
                e.target.style.backgroundColor = "lightblue";
                e.target.style.cursor = "pointer";
            })
            outputCity.addEventListener('mouseout', function(e){
                e.target.style.backgroundColor = "";
            })
            outputCity.addEventListener('click', function(e){
                cityInput.value = matchingCities[i].name;
                loadCityInfos(cityInput.value);
                dropdown.innerHTML="";
                cityInput.focus();
            })

        }
    }    
    
}

// Load city weather
function loadCityInfos(cityValue) {
    dropdown.style.display= 'none';

    let weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = "";

    var xhr = new XMLHttpRequest ();
    var myURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&appid=0840207763b3bb99dc2cce93ddb094d0&units=metric`;
    xhr.open('GET', myURL);
    xhr.addEventListener('readystatechange', () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            let obj = JSON.parse(xhr.responseText);
            console.log(obj);

            let lowerDiv = document.createElement('div');
            lowerDiv.id = 'bottom';
            for(i=0; i<obj.list.length; i+=8) {
                if(i==0){
                    let objCity = Object.assign(obj.list[i], {city: obj.city.name})
                    console.log(objCity);

                    let today = nextWeather(objCity,true);
                    weatherResult.appendChild(today);
                }else{
                    lowerDiv.appendChild(nextWeather(obj.list[i]));
                }
            }
            weatherResult.appendChild(lowerDiv);
        } else if (xhr.status != 200) {
            weatherResult.textContent = xhr.status + ' - ' + xhr.statusText;
        }
    })
    xhr.send(null);
}

// Apply weather results to respective divs
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
    let date = new Date(dataOfTheDay.dt_txt);
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



// Execution
cityInput.addEventListener('keyup', function(e) {
    if(e.key == "ArrowDown") {
        if(divSelected > 9) {
            divSelected = 9;
            return;
        } else {
            divs[++divSelected].classList.add("highlight");
            divs[divSelected-1].classList.remove("highlight");
        }
        
    } else if(e.key == "ArrowUp") {
        if(divSelected < 0){
            divSelected = 0;
            return;
        } else {
            divs[--divSelected].classList.add("highlight"); 
            divs[divSelected+1].classList.remove("highlight");
        }  
 
    } else if(e.key === 'Enter') {
        cityInput.value = divs[divSelected].textContent.split(' - ').shift();
        loadCityInfos(e.target.value);

    } else if(cityInput.value == "") {
        dropdown.style.display= 'none';

    } else {
        divSelected = -1;
        getCityID(e.target.value);

    }
});