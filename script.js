const apiKey = "3bd021b2941947ebaea145127252508";
let city = "Manila";

async function getWeather(cityName) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityName}&days=5&aqi=no&alerts=no`;

  try {
    showLoading(true);
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      document.querySelector(".weather-container").innerHTML = `<p>❌ City not found!</p>`;
      document.querySelector(".weather-details").innerHTML = "";
      document.querySelector(".forecast-container").innerHTML = "";
      showLoading(false);
      return;
    }

    updateUI(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
  } finally {
    showLoading(false);
  }
}

function updateUI(data) {
  const container = document.querySelector(".weather-container");
  const details = document.querySelector(".weather-details");
  const visuals = document.querySelector(".weather-visuals");
  const forecastContainer = document.querySelector(".forecast-container");
  const body = document.body;

  const temp = data.current.temp_c;
  const condition = data.current.condition.text;
  const feelsLike = data.current.feelslike_c;
  const humidity = data.current.humidity;
  const wind = data.current.wind_kph;
  const isDay = data.current.is_day; // 1 = day, 0 = night
  const cityName = data.location.name;

  // Main info
  container.innerHTML = `
    <h1>${cityName}</h1>
    <p>${temp}°C | ${condition}</p>
  `;

  // Extra details
  details.innerHTML = `
    <p>🌡 Feels like: ${feelsLike}°C</p>
    <p>💧 Humidity: ${humidity}%</p>
    <p>🌬 Wind: ${wind} kph</p>
  `;

  // Reset visuals
  body.className = "";
  visuals.innerHTML = "";
  document.querySelectorAll(".star").forEach(star => star.remove());

  // Theme + visuals
  if (!isDay) {
    body.classList.add("night");
    visuals.innerHTML = `<div class="moon-icon"></div>`;
    addStars(25);
  } else if (condition.toLowerCase().includes("rain")) {
    body.classList.add("rainy");
    visuals.innerHTML = `<div class="cloud-icon"></div>`;
    addRain(30);
  } else if (condition.toLowerCase().includes("snow")) {
    body.classList.add("cloudy");
    visuals.innerHTML = `<div class="cloud-icon"></div>`;
    addSnow(20);
  } else if (condition.toLowerCase().includes("cloud")) {
    body.classList.add("cloudy");
    visuals.innerHTML = `<div class="cloud-icon"></div>`;
  } else {
    body.classList.add("sunny");
    visuals.innerHTML = `<div class="sun-icon"></div>`;
  }

  // 📅 5-Day Forecast
  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach(day => {
    const date = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
    const icon = day.day.condition.icon;
    const max = day.day.maxtemp_c;
    const min = day.day.mintemp_c;

    const card = `
      <div class="forecast-card">
        <h3>${date}</h3>
        <img src="https:${icon}" alt="icon">
        <p>⬆ ${max}°C</p>
        <p>⬇ ${min}°C</p>
      </div>
    `;
    forecastContainer.innerHTML += card;
  });
}

// 🌟 Stars
function addStars(count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("span");
    star.classList.add("star");
    star.style.top = Math.random() * 100 + "%";
    star.style.left = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    document.body.appendChild(star);
  }
}

// Raindrops
function addRain(count) {
  const visuals = document.querySelector(".weather-visuals");
  for (let i = 0; i < count; i++) {
    const drop = document.createElement("div");
    drop.classList.add("raindrop");
    drop.style.left = Math.random() * 100 + "vw";
    drop.style.animationDuration = (Math.random() * 0.5 + 0.8) + "s";
    visuals.appendChild(drop);
  }
}

// Snowflakes
function addSnow(count) {
  const visuals = document.querySelector(".weather-visuals");
  for (let i = 0; i < count; i++) {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snowflake");
    snowflake.innerHTML = "❄";
    snowflake.style.left = Math.random() * 100 + "vw";
    snowflake.style.fontSize = Math.random() * 10 + 10 + "px";
    snowflake.style.animationDuration = (Math.random() * 5 + 5) + "s";
    snowflake.style.opacity = Math.random();
    visuals.appendChild(snowflake);
  }
}

// Show/Hide Loading
function showLoading(show) {
  const loader = document.getElementById("loading");
  loader.style.display = show ? "flex" : "none";
}

// Search functionality
function searchWeather() {
  const input = document.getElementById("cityInput").value.trim();
  if (input) {
    getWeather(input);
  }
}

// Press Enter to search
document.getElementById("cityInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchWeather();
  }
});

// Load default city
getWeather(city);
