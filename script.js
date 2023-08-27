const apiKey = 'e1a0a5b52298a1db65654fbbcd534321';

const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-input');
const currentWeather = document.getElementById('current-weather');
const forecast = document.getElementById('forecast');
const searchHistory = document.querySelector('#search-history ul');

cityForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName !== '') {
    await getWeatherData(cityName);
  }
});

async function getWeatherData(city) {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    const data = await response.json();
    updateCurrentWeather(data);
    updateSearchHistory(city);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function updateCurrentWeather(data) {
  const { name, dt, weather, main, wind } = data;
  const date = new Date(dt * 1000).toLocaleDateString();
  const iconCode = weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
  const temperature = (main.temp - 273.15).toFixed(2); // Convert to Celsius

  currentWeather.innerHTML = `
    <h2>${name} (${date}) <img src="${iconUrl}" alt="Weather Icon"></h2>
    <p>Temperature: ${temperature} °C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind Speed: ${wind.speed} m/s</p>
  `;
}

function updateSearchHistory(city) {
  const listItem = document.createElement('li');
  listItem.textContent = city;
  listItem.addEventListener('click', function () {
    getWeatherData(city);
  });
  searchHistory.appendChild(listItem);

  saveSearchHistory();
}

function saveSearchHistory() {
  const searchHistoryItems = Array.from(searchHistory.children).map(item => item.textContent);
  localStorage.setItem('searchHistory', JSON.stringify(searchHistoryItems));
}

function loadSearchHistory() {
  const savedHistory = JSON.parse(localStorage.getItem('searchHistory'));
  if (savedHistory) {
    savedHistory.forEach(city => {
      const listItem = document.createElement('li');
      listItem.textContent = city;
      listItem.addEventListener('click', function () {
        getWeatherData(city);
      });
      searchHistory.appendChild(listItem);
    });
  }
}

loadSearchHistory();
