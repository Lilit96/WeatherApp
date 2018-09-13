const API_KEY = "appid=8dad9630b8862bf98f66bdfc05c52b72";
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";
const DEFAULT_CITY = 'Yerevan';
const DEFAULT_COUNTRY = 'AM';
const KELVIN = 273;
const URL_CITIES = 'city.list.json';

window.addEventListener('load', selectedCountry(DEFAULT_COUNTRY));

/**
 * CREATE SELECT
 */


var dayDiv = document.getElementsByClassName('weekday-item');
var sel = document.createElement('select');
var sel_week = document.createElement('select');
var addCity = document.getElementById('addcity');

sel_week.addEventListener('change', (e) => {
  getDay(e.target.value);
});

sel.addEventListener('change', function (e) {
  let cityId = e.target.value;
  loadWeatherInfo(cityId);
});

/**
 * CREATE SELECT
 */


function response(response) {
  return response.json().then(json => {
    return response.ok ? json : Promise.reject(json);
  });
}

function selectedCountry(countryName) {
  fetch(URL_CITIES)
    .then(response)
    .then(cities => {
      sel.innerHTML = "";
      cities.forEach(item => {
        if (item.country == countryName) {
          let opt = document.createElement('option');
          opt.innerHTML = item.name;
          let cityId = item.id;
          if (item.name === DEFAULT_CITY) {
            opt.setAttribute('selected', true);
            loadWeatherInfo(cityId);
          }
          opt.setAttribute('value', cityId);
          sel.appendChild(opt);
        }
      });
      addcity.appendChild(sel);
    })
    .catch((error) => {
      console.error(error);
    });
}

function loadWeatherInfo(cityId) {
  fetch(`${BASE_URL}?id=${cityId}&${API_KEY}`)
    .then(response)
    .then((data) => {
      setData(data);
    })
    .catch((error) => {
      console.error(error);
    });
}

/******CREATE A WEEK WEATHER */
var weatherWeek = [];

function setData(data) {
  let x = [];
  weatherWeek = [];
  data.list.forEach(item => {
    let date = new Date(item.dt_txt).getDate();
    if (x.indexOf(date) == -1) {
      x.push(date);
      weatherWeek.push(item);
    }
  });
  createWeekday();
  getDay(0);
}

function createWeekday() {

  document.getElementById('weekDay').innerHTML = '';
  let dayId = 0;

  weatherWeek.map((item, key) => {
    dayDiv[key].innerHTML = '';
    let date = new Date(item.dt_txt);


    dayDiv[key].innerHTML += date.getDate() + '<br>';
    dayDiv[key].innerHTML += Math.round(weatherWeek[key].main.temp - KELVIN) + '&#176;C';
    dayDiv[key].addEventListener('click', changeDay);
  });

}

function changeDay(e) {
  document.getElementsByClassName('weekday-item active')[0].classList.remove('active');
  e.target.classList.add('active');
  let index;
  for (let k in dayDiv) {
    if (dayDiv[k].innerHTML == e.target.innerHTML) {
      index = k;
    }
  }
  getDay(index);

}

/**
 * 
 * Change date in html
 */
function getDay(dayId) {
  document.getElementById('temp').innerHTML = Math.round(weatherWeek[dayId].main.temp - KELVIN) + '&#176;C';
  document.getElementById('wind').innerHTML = weatherWeek[dayId].wind.speed + 'MPH';
  document.getElementById('hum').innerHTML = weatherWeek[dayId].main.humidity + '%';
  document.getElementById('pres').innerHTML = Math.round(weatherWeek[dayId].main.pressure * 0.0075 * 100) + 'mb';
  document.getElementById('img').setAttribute('src', `https://openweathermap.org/img/w/${weatherWeek[dayId].weather[0].icon}.png`);
}