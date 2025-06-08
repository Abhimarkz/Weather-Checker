const apiKey = '6e17e96dcf837278cc7336e3f54cd209';

const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const result = document.getElementById('result');
const forecastEl = document.getElementById('forecast');
const darkModeToggle = document.getElementById('darkModeToggle');

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

searchBtn.addEventListener('click', () => {
  searchWeather();
});

cityInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchWeather();
});

function searchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    result.innerHTML = `<p class="error">⚠️ Please enter a city name.</p>`;
    return;
  }
  fetchWeather(city);
  fetchForecast(city);
  cityInput.value = '';
}

function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('City not found');
      return response.json();
    })
    .then(data => {
      updateWeatherUI(data);
    })
    .catch(error => {
      result.innerHTML = `<p class="error">❌ ${error.message}</p>`;
    });
}

function fetchWeatherByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Location weather not found');
      return response.json();
    })
    .then(data => {
      updateWeatherUI(data);
    })
    .catch(error => {
      result.innerHTML = `<p class="error">❌ ${error.message}</p>`;
    });
}

function updateWeatherUI(data) {
  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  const weatherMain = data.weather[0].main.toLowerCase();
  changeBackground(weatherMain);

  const weatherHTML = `
    <img src="${iconUrl}" alt="${data.weather[0].description}">
    <h2>${data.name}, ${data.sys.country}</h2>
    <p><strong>${data.weather[0].main}</strong> - ${data.weather[0].description}</p>
    <p>🌡️ Temp: <strong>${data.main.temp}°C</strong></p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
  `;

  result.innerHTML = weatherHTML;
  
}

function changeBackground(weather) {
  let bgUrl;

  switch (weather) {
    case 'clear':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?sunny,clear-sky")';
      break;
    case 'clouds':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?cloudy,sky")';
      break;
    case 'rain':
    case 'drizzle':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?rain,raindrops")';
      break;
    case 'thunderstorm':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?thunderstorm,lightning")';
      break;
    case 'snow':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?snow,winter")';
      break;
    case 'mist':
    case 'fog':
    case 'haze':
      bgUrl = 'url("https://source.unsplash.com/1600x900/?fog,haze")';
      break;
    default:
      bgUrl = 'url("https://source.unsplash.com/1600x900/?weather")';
      break;
  }

  document.body.style.backgroundImage = '${bgUrl}';
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.transition = 'background-image 0.5s ease-in-out';
  console.log("Weather main:",weather);
  console.log("Background URL:",bgUrl);
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Forecast not found');
      return response.json();
    })
    .then(data => {
      showForecast(data);
    })
    .catch(error => {
      forecastEl.innerHTML = `<p class="error">❌ ${error.message}</p>`;
    });
}

function showForecast(data) {
  forecastEl.innerHTML = '';

  // Filter to show one forecast per day (API gives every 3 hours)
  const dailyData = data.list.filter((item, index) => index % 8 === 0);

  dailyData.forEach(day => {
    const date = new Date(day.dt_txt).toDateString();
    const icon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

    forecastEl.innerHTML += `
      <div class="forecast-card">
        <p>${date}</p>
        <img src="${icon}" alt="${day.weather[0].description}" />
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}

function autoLocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
        fetchForecastByCoords(latitude, longitude);
      },
      error => {
        console.warn('Geolocation failed:', error.message);
        fetchWeather('New Delhi');
        fetchForecast('New Delhi');
      }
    );
  } else {
    fetchWeather('New Delhi');
    fetchForecast('New Delhi');
  }
}

function fetchForecastByCoords(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error('Forecast not found');
      return response.json();
    })
    .then(data => {
      showForecast(data);
    })
    .catch(error => {
      forecastEl.innerHTML = `<p class="error">❌ ${error.message}</p>`;
    });
}

const cities = [
  // India - Major Cities
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Ahmedabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Jaipur",
  "Surat",
  "Lucknow",
  "Kanpur",
  "Nagpur",
  "Indore",
  "Bhopal",
  "Patna",
  "Vadodara",
  "Ludhiana",
  "Agra",
  "Nashik",
  "Faridabad",
  "Meerut",
  "Rajkot",
  "Varanasi",
  "Srinagar",
  "Amritsar",
  "Allahabad",
  "Ranchi",
  "Coimbatore",
  "Jabalpur",
  "Gwalior",
  "Vijayawada",
  "Raipur",
  "Kota",
  "Guwahati",
  "Chandigarh",
  "Thiruvananthapuram",
  "Mysore",
  "Jodhpur",
  "Madurai",
  "Dehradun",
  "Noida",
  "Gurgaon",
  "Howrah",
  "Bhubaneswar",
  "Tiruchirappalli",
  "Udaipur",
  "Mangalore",
  "Shillong",
  "Imphal",
  "Panaji",
  "Puducherry",
  "Aizawl",
  "Kozhikode",
  "Thrissur",
  "Dhanbad",
  "Jamshedpur",
  "Bilaspur",
  "Ajmer",
  "Cuttack",
  "Siliguri",

  // International Cities (for global users)
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "San Francisco",
  "London",
  "Berlin",
  "Paris",
  "Madrid",
  "Rome",
  "Tokyo",
  "Seoul",
  "Beijing",
  "Shanghai",
  "Dubai",
  "Doha",
  "Abu Dhabi",
  "Singapore",
  "Bangkok",
  "Jakarta",
  "Kuala Lumpur",
  "Istanbul",
  "Moscow",
  "Toronto",
  "Vancouver",
  "Sydney",
  "Melbourne",
  "Cape Town",
  "Cairo",
  "Lagos",
  "Nairobi",
  "Mexico City",
  "Buenos Aires",
  "Sao Paulo",
  "Rio de Janeiro"
];

const cityInputt = document.getElementById("cityInput");
const suggestionsBox = document.getElementById("suggestions");

cityInput.addEventListener("input", () => {
  const value = cityInput.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (!value) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matchedCities = cities.filter(city => city.toLowerCase().startsWith(value));
  if (matchedCities.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  matchedCities.forEach(city => {
    const div = document.createElement("div");
    div.textContent = city;
    div.classList.add("suggestion-item");
    div.addEventListener("click", () => {
      cityInput.value = city;
      suggestionsBox.innerHTML = "";
      suggestionsBox.style.display = "none";
    });
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
});

// Hide suggestions when clicking outside
document.addEventListener("click", (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== cityInput) {
    suggestionsBox.style.display = "none";
  }
});
populateCitySuggestions(); // Call on load

// Initialize app on load
window.onload = () => {
  autoLocate();
};