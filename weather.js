
const app = document.getElementById("app");

// Weather icons
function weatherIcon(code) {
  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "🌤️";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

function weatherText(code) {
  const descriptions = {
    0: "Clear Sky",
    1: "Mainly Clear",
    2: "Partly Cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing Rime Fog",
    51: "Light Drizzle",
    53: "Moderate Drizzle",
    55: "Dense Drizzle",
    61: "Slight Rain",
    63: "Moderate Rain",
    65: "Heavy Rain",
    71: "Light Snow",
    73: "Moderate Snow",
    75: "Heavy Snow",
    80: "Rain Showers",
    81: "Moderate Showers",
    82: "Heavy Showers",
    95: "Thunderstorm",
    96: "Thunderstorm with Hail",
    99: "Severe Thunderstorm"
  };

  return descriptions[code] || "Mixed Weather";
}

// App design
app.innerHTML = `
  <div class="weather-app">
    <header class="topbar">
      <div class="brand">☁️ Sky<span>Cast</span></div>
      <div class="live-label">● LIVE WEATHER</div>
    </header>

    <section class="hero">
      <p class="eyebrow">YOUR PERSONAL WEATHER STATION</p>
      <h1>Weather, <span>reimagined.</span></h1>
      <p class="subtitle">
        Real-time conditions, forecasts and your world on the map.
      </p>

      <form id="searchForm" class="search-box">
        <span>⌕</span>
        <input
          id="cityInput"
          type="text"
          placeholder="Search city... e.g. Kolkata"
          autocomplete="off"
          required
        />
        <button type="submit">Search ↗</button>
      </form>

      <button id="locationBtn" class="location-btn">
        ◎ Use My Current Location
      </button>
      <p id="status" class="status">Loading weather...</p>
    </section>

    <main>
      <section id="currentWeather" class="current-card">
        <div class="loading">Loading your weather...</div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">PLAN AHEAD</p>
            <h2>5-Day Forecast</h2>
          </div>
          <span class="section-icon">📅</span>
        </div>
        <div id="forecast" class="forecast-grid"></div>
      </section>

      <section class="section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">EXPLORE YOUR WORLD</p>
            <h2>Weather Map</h2>
          </div>
          <span class="section-icon">📍</span>
        </div>
        <p class="map-description">
          Explore your selected city's location on the interactive map.
        </p>
        <div id="weatherMap"></div>
        <p class="map-credit">
          Map data © OpenStreetMap contributors
        </p>
      </section>

      <footer>
        <p>SkyCast • Weather powered by Open-Meteo</p>
        <p>Stay informed. Stay prepared. 🌍</p>
      </footer>
    </main>
  </div>
`;

// Styling
const style = document.createElement("style");

style.textContent = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: Arial, Helvetica, sans-serif;
    color: #f8fafc;
    background:
      radial-gradient(ellipse at 15% 10%, #164e63 0%, transparent 38%),
      radial-gradient(ellipse at 85% 35%, #312e81 0%, transparent 35%),
      #070b18;
  }

  .weather-app {
    width: min(1100px, 94%);
    margin: auto;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 25px 0;
    border-bottom: 1px solid #ffffff18;
  }

  .brand {
    font-size: 25px;
    font-weight: 800;
  }

  .brand span {
    color: #38bdf8;
  }

  .live-label {
    color: #86efac;
    font-size: 11px;
    letter-spacing: 1.5px;
    font-weight: bold;
  }

  .hero {
    text-align: center;
    padding: 60px 12px 40px;
  }

  .eyebrow {
    color: #38bdf8;
    font-size: 11px;
    letter-spacing: 2px;
    font-weight: bold;
  }

  h1 {
    font-size: clamp(35px, 6vw, 65px);
    margin: 16px 0;
    letter-spacing: -2px;
  }

  h1 span {
    color: #38bdf8;
  }

  .subtitle, .map-description {
    color: #a7b3ca;
    line-height: 1.7;
  }

  .search-box {
    max-width: 580px;
    margin: 28px auto 14px;
    padding: 7px;
    display: flex;
    gap: 10px;
    align-items: center;
    background: #ffffff0c;
    border: 1px solid #ffffff25;
    border-radius: 15px;
  }

  .search-box > span {
    padding-left: 12px;
    font-size: 25px;
  }

  .search-box input {
    min-width: 0;
    flex: 1;
    padding: 13px 5px;
    background: transparent;
    border: 0;
    outline: none;
    color: white;
    font-size: 15px;
  }

  .search-box input::placeholder {
    color: #8492ab;
  }

  button {
    cursor: pointer;
    border: 0;
    border-radius: 10px;
    font-weight: bold;
  }

  .search-box button {
    background: #38bdf8;
    color: #07111f;
    padding: 14px 18px;
  }

  .location-btn {
    color: #dbeafe;
    background: #ffffff0c;
    border: 1px solid #ffffff24;
    padding: 12px 17px;
    margin-top: 8px;
  }

  .status {
    color: #93a4bd;
    font-size: 13px;
    min-height: 18px;
  }

  main {
    padding-bottom: 25px;
  }

  .current-card, .section {
    background: #ffffff09;
    border: 1px solid #ffffff17;
    border-radius: 22px;
    padding: 25px;
    margin-bottom: 25px;
    backdrop-filter: blur(10px);
  }

  .current-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
  }

  .city-name {
    font-size: 27px;
    margin: 5px 0;
  }

  .muted {
    color: #9eacc4;
    font-size: 13px;
  }

  .weather-main {
    display: flex;
    align-items: center;
    gap: 22px;
    margin: 28px 0;
  }

  .big-icon {
    font-size: 76px;
  }

  .temperature {
    font-size: clamp(50px, 8vw, 75px);
    font-weight: 800;
    letter-spacing: -3px;
  }

  .condition {
    color: #c2d1e6;
    font-size: 16px;
    margin-top: 4px;
  }

  .weather-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  .stat {
    padding: 17px 12px;
    border-radius: 14px;
    background: #ffffff08;
    border: 1px solid #ffffff0c;
  }

  .stat-label {
    color: #9eacc4;
    font-size: 12px;
  }

  .stat-value {
    margin-top: 10px;
    font-size: 21px;
    font-weight: bold;
  }

  .section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .section-heading h2 {
    margin: 7px 0 20px;
    font-size: 25px;
  }

  .section-icon {
    font-size: 26px;
  }

  .forecast-grid {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
  }

  .forecast-day {
    text-align: center;
    padding: 17px 8px;
    border-radius: 15px;
    background: #ffffff08;
  }

  .forecast-date {
    color: #a7b3ca;
    font-size: 12px;
  }

  .forecast-icon {
    font-size: 30px;
    margin: 15px 0;
  }

  .forecast-temp {
    font-weight: bold;
    font-size: 17px;
  }

  .forecast-low {
    margin-top: 7px;
    color: #91a1ba;
    font-size: 13px;
  }

  .forecast-rain {
    color: #7dd3fc;
    font-size: 11px;
    margin-top: 12px;
  }

  #weatherMap {
    height: 380px;
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #38bdf855;
    background: #101827;
  }

  .map-credit {
    color: #94a3b8;
    font-size: 11px;
    margin-bottom: 0;
  }

  footer {
    padding: 15px 0 30px;
    text-align: center;
    color: #8e9db6;
    font-size: 12px;
    line-height: 1.8;
  }

  .loading, .empty {
    padding: 30px 5px;
    color: #a7b3ca;
    text-align: center;
  }

  @media (max-width: 650px) {
    .hero {
      padding-top: 40px;
    }

    .current-card, .section {
      padding: 17px;
    }

    .weather-stats {
      grid-template-columns: repeat(2, 1fr);
    }

    .forecast-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .forecast-day:last-child {
      grid-column: 1 / -1;
    }

    #weatherMap {
      height: 300px;
    }

    .search-box button {
      padding: 13px 11px;
    }

    .big-icon {
      font-size: 60px;
    }
  }
`;

document.head.appendChild(style);

// Map setup
let weatherMap = null;
let weatherMarker = null;

function initializeMap(lat, lon, cityName) {
  if (typeof L === "undefined") {
    document.getElementById("weatherMap").innerHTML =
      '<p class="empty">Map library load nahi hui. Internet check karo.</p>';
    return;
  }

  if (!weatherMap) {
    weatherMap = L.map("weatherMap").setView([lat, lon], 10);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 19
      }
    ).addTo(weatherMap);

    weatherMarker = L.marker([lat, lon]).addTo(weatherMap);
  } else {
    weatherMap.setView([lat, lon], 10);
    weatherMarker.setLatLng([lat, lon]);
  }

  weatherMarker
    .bindPopup("📍 " + cityName)
    .openPopup();

  setTimeout(() => weatherMap.invalidateSize(), 150);
}

// Get location information
async function findCity(city) {
  const url =
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(city) +
    "&count=1&language=en&format=json";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("City search failed.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City nahi mila. Spelling check karo.");
  }

  return data.results[0];
}

// Fetch weather
async function getWeather(latitude, longitude) {
  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    "&current=temperature_2m,relative_humidity_2m,apparent_temperature," +
    "is_day,precipitation,weather_code,wind_speed_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min," +
    "precipitation_probability_max" +
    "&timezone=auto&forecast_days=5";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Weather data load nahi hua.");
  }

  return await response.json();
}

// Display weather and forecast
function displayWeather(place, data) {
  const current = data.current;
  const daily = data.daily;

  const cityName = place.name;
  const region = [place.admin1, place.country]
    .filter(Boolean)
    .join(", ");

  document.getElementById("currentWeather").innerHTML = `
    <div class="current-top">
      <div>
        <p class="muted">CURRENT WEATHER</p>
        <h2 class="city-name">${escapeHTML(cityName)}</h2>
        <p class="muted">${escapeHTML(region)}</p>
      </div>
      <div class="muted">
        ${new Date(current.time).toLocaleString([], {
          weekday: "long",
          hour: "2-digit",
          minute: "2-digit"
        })}
      </div>
    </div>

    <div class="weather-main">
      <div class="big-icon">${weatherIcon(current.weather_code)}</div>
      <div>
        <div class="temperature">
          ${Math.round(current.temperature_2m)}°
        </div>
        <div class="condition">
          ${weatherText(current.weather_code)}
        </div>
        <p class="muted">
          Feels like ${Math.round(current.apparent_temperature)}°C
        </p>
      </div>
    </div>

    <div class="weather-stats">
      <div class="stat">
        <div class="stat-label">💧 Humidity</div>
        <div class="stat-value">${current.relative_humidity_2m}%</div>
      </div>

      <div class="stat">
        <div class="stat-label">💨 Wind Speed</div>
        <div class="stat-value">${current.wind_speed_10m} <small>km/h</small></div>
      </div>

      <div class="stat">
        <div class="stat-label">🌧️ Precipitation</div>
        <div class="stat-value">${current.precipitation} <small>mm</small></div>
      </div>

      <div class="stat">
        <div class="stat-label">🌡️ Feels Like</div>
        <div class="stat-value">${Math.round(current.apparent_temperature)}°</div>
      </div>
    </div>
  `;

  document.getElementById("forecast").innerHTML =
    daily.time.map((date, index) => {
      const day = new Date(date + "T12:00:00");

      return `
        <div class="forecast-day">
          <div class="forecast-date">
            ${index === 0 ? "Today" : day.toLocaleDateString("en", {
              weekday: "short"
            })}
          </div>

          <div class="forecast-icon">
            ${weatherIcon(daily.weather_code[index])}
          </div>

          <div class="forecast-temp">
            ${Math.round(daily.temperature_2m_max[index])}°
          </div>

          <div class="forecast-low">
            ${Math.round(daily.temperature_2m_min[index])}° low
          </div>

          <div class="forecast-rain">
            🌧 ${daily.precipitation_probability_max[index] ?? 0}%
          </div>
        </div>
      `;
    }).join("");

  initializeMap(place.latitude, place.longitude, cityName);

  document.getElementById("status").textContent =
    "Weather updated successfully ✓";
}

// Prevent city names from being interpreted as HTML
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

// Search a city and update everything
async function loadCity(city) {
  const status = document.getElementById("status");
  const searchButton = document.querySelector("#searchForm button");

  status.textContent = "Finding city and loading weather...";
  searchButton.disabled = true;

  try {
    const place = await findCity(city);
    const weather = await getWeather(place.latitude, place.longitude);

    displayWeather(place, weather);
  } catch (error) {
    status.textContent = error.message || "Something went wrong.";
  } finally {
    searchButton.disabled = false;
  }
}

// Search form
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const city = document.getElementById("cityInput").value.trim();

  if (city) {
    loadCity(city);
  }
});

// Current location button
document.getElementById("locationBtn").addEventListener("click", () => {
  const status = document.getElementById("status");

  if (!navigator.geolocation) {
    status.textContent = "Your browser does not support location.";
    return;
  }

  status.textContent = "Getting your location...";

  navigator.geolocation.getCurrentPosition(
    async position => {
      try {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const url =
          "https://geocoding-api.open-meteo.com/v1/reverse" +
          `?latitude=${latitude}&longitude=${longitude}&language=en&format=json`;

        const response = await fetch(url);
        const data = await response.json();

        const place = data.results?.[0] || {
          name: "My Location",
          admin1: "",
          country: "",
          latitude,
          longitude
        };

        // Use the exact coordinates obtained from the device
        place.latitude = latitude;
        place.longitude = longitude;

        const weather = await getWeather(latitude, longitude);
        displayWeather(place, weather);
      } catch (error) {
        status.textContent = "Location weather load nahi hua.";
      }
    },
    () => {
      status.textContent =
        "Location permission allow karo, ya city search karo.";
    }
  );
});

// Load default city
loadCity("Kolkata");
