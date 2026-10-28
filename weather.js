
const app = document.getElementById("app");

app.innerHTML = `
  <div class="weather-app">
    <header class="topbar">
      <div class="brand">🌦️ SkyCast</div>
      <span class="live"><span></span> LIVE WEATHER</span>
    </header>

    <section class="hero">
      <p class="eyebrow">YOUR WORLD, AT A GLANCE</p>
      <h1>Weather, <span>reimagined.</span></h1>
      <p class="subtitle">Discover the weather anywhere on Earth.</p>

      <form id="weatherForm" class="search">
        <span>⌕</span>
        <input id="cityInput" placeholder="Enter a city, e.g. Kolkata" required>
        <button type="submit">Explore ↗</button>
      </form>

      <p id="status">Search a city to discover its current weather.</p>
    </section>

    <section id="weatherResult" class="weather-result" hidden>
      <div class="city-heading">
        <div>
          <p class="eyebrow">CURRENT CONDITIONS</p>
          <h2 id="cityName">--</h2>
          <p id="description">Loading...</p>
        </div>
        <div id="weatherIcon" class="weather-icon">🌤️</div>
      </div>

      <div class="temperature">
        <span id="temperature">--</span><sup>°C</sup>
      </div>
      <p>Feels like <strong id="feelsLike">--</strong>°C</p>

      <div class="stats">
        <div class="stat"><span>💧 Humidity</span><strong id="humidity">--%</strong></div>
        <div class="stat"><span>💨 Wind</span><strong id="wind">-- km/h</strong></div>
        <div class="stat"><span>🌡️ Pressure</span><strong id="pressure">-- hPa</strong></div>
        <div class="stat"><span>☁️ Cloud cover</span><strong id="cloud">--%</strong></div>
      </div>
    </section>

    <section class="map-section">
      <div class="section-heading">
        <div>
          <p class="eyebrow">EXPLORE THE PLANET</p>
          <h2>Weather map</h2>
        </div>
        <span class="map-tag">INTERACTIVE</span>
      </div>
      <div id="map"></div>
      <p class="map-note">Move around the map and zoom to explore locations.</p>
    </section>

    <footer>SkyCast · Made for curious minds 🌍</footer>
  </div>
`;

const style = document.createElement("style");
style.textContent = `
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #081221;
    color: #f2f7ff;
    font-family: Inter, Segoe UI, Arial, sans-serif;
  }
  .weather-app {
    width: min(100% - 32px, 1050px);
    margin: auto;
  }
  .topbar {
    display: flex; justify-content: space-between;
    align-items: center; padding: 25px 0;
    border-bottom: 1px solid #253449;
  }
  .brand { font-size: 24px; font-weight: 800; }
  .live, .map-tag {
    color: #77e8c3; font-size: 11px;
    letter-spacing: 1.5px; font-weight: 700;
  }
  .live span {
    display: inline-block; width: 7px; height: 7px;
    background: #77e8c3; border-radius: 50%; margin-right: 7px;
  }
  .hero { text-align: center; padding: 65px 0 35px; }
  .eyebrow {
    color: #7de8c7; font-size: 11px;
    letter-spacing: 2px; font-weight: 700;
  }
  h1 { font-size: clamp(35px, 7vw, 65px); margin: 15px 0; }
  h1 span {
    background: linear-gradient(90deg, #72e7c5, #7ca7ff);
    color: transparent; background-clip: text;
  }
  .subtitle { color: #9aabc2; }
  .search {
    display: flex; gap: 10px; padding: 8px;
    background: #132238; border: 1px solid #2a3d55;
    border-radius: 15px; max-width: 600px;
    margin: 30px auto 15px;
  }
  .search span { padding: 10px; font-size: 23px; }
  .search input {
    flex: 1; min-width: 0; background: transparent;
    border: 0; outline: none; color: white; font-size: 15px;
  }
  .search button {
    border: 0; border-radius: 10px; padding: 13px 18px;
    background: #78e6c4; color: #071b20;
    font-weight: 800; cursor: pointer;
  }
  #status { color: #9aabc2; font-size: 13px; }
  .weather-result, .map-section {
    background: #101e31; border: 1px solid #263950;
    padding: 25px; border-radius: 20px; margin: 25px 0;
  }
  .city-heading, .section-heading {
    display: flex; justify-content: space-between;
    align-items: center; gap: 15px;
  }
  h2 { margin: 8px 0; font-size: 28px; }
  #description { color: #a7b7cc; text-transform: capitalize; }
  .weather-icon { font-size: 60px; }
  .temperature { font-size: 75px; font-weight: 800; margin-top: 20px; }
  .temperature sup { font-size: 25px; vertical-align: top; }
  .stats {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 12px; margin-top: 30px;
  }
  .stat {
    background: #172940; padding: 18px;
    border-radius: 13px; display: grid; gap: 12px;
  }
  .stat span { color: #a7b7cc; font-size: 12px; }
  .stat strong { font-size: 20px; }
  #map { height: 420px; width: 100%; border-radius: 14px; z-index: 1; }
  .map-note { color: #9aabc2; font-size: 12px; }
  footer { text-align: center; color: #7f91a9; padding: 25px; }
  @media (max-width: 650px) {
    .stats { grid-template-columns: repeat(2, 1fr); }
    .hero { padding-top: 40px; }
    .weather-result, .map-section { padding: 17px; }
    .search button { padding: 11px; }
    #map { height: 330px; }
  }
`;
document.head.appendChild(style);

// Initialize the interactive map
const map = L.map("map").setView([22.5726, 88.3639], 5);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);

let marker;

async function searchWeather(city) {
  const status = document.getElementById("status");
  const result = document.getElementById("weatherResult");

  status.textContent = "Finding weather for " + city + "...";

  try {
    // Find the city's coordinates
    const geoURL =
      "https://geocoding-api.open-meteo.com/v1/search?name=" +
      encodeURIComponent(city) + "&count=1&language=en&format=json";

    const geoResponse = await fetch(geoURL);
    if (!geoResponse.ok) throw new Error("Location service unavailable.");

    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }

    const place = geoData.results[0];

    // Get current weather; no API key required
    const weatherURL =
      "https://api.open-meteo.com/v1/forecast?latitude=" +
      place.latitude + "&longitude=" + place.longitude +
      "&current=temperature_2m,relative_humidity_2m,apparent_temperature," +
      "is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m" +
      "&timezone=auto";

    const weatherResponse = await fetch(weatherURL);
    if (!weatherResponse.ok) throw new Error("Weather service unavailable.");

    const data = await weatherResponse.json();
    const current = data.current;

    const weatherTypes = {
      0: ["Clear sky", "☀️"],
      1: ["Mainly clear", "🌤️"],
      2: ["Partly cloudy", "⛅"],
      3: ["Overcast", "☁️"],
      45: ["Foggy", "🌫️"],
      48: ["Depositing rime fog", "🌫️"],
      51: ["Light drizzle", "🌦️"],
      53: ["Moderate drizzle", "🌦️"],
      55: ["Dense drizzle", "🌧️"],
      61: ["Slight rain", "🌦️"],
      63: ["Moderate rain", "🌧️"],
      65: ["Heavy rain", "🌧️"],
      71: ["Slight snowfall", "🌨️"],
      73: ["Moderate snowfall", "❄️"],
      75: ["Heavy snowfall", "❄️"],
      80: ["Rain showers", "🌦️"],
      81: ["Moderate rain showers", "🌧️"],
      82: ["Violent rain showers", "⛈️"],
      95: ["Thunderstorm", "⛈️"],
      96: ["Thunderstorm with hail", "⛈️"],
      99: ["Severe thunderstorm with hail", "⛈️"]
    };

    const condition = weatherTypes[current.weather_code] ||
      ["Variable conditions", "🌍"];

    document.getElementById("cityName").textContent =
      place.name + (place.country ? ", " + place.country : "");
    document.getElementById("description").textContent = condition[0];
    document.getElementById("weatherIcon").textContent =
      current.is_day ? condition[1] : "🌙";
    document.getElementById("temperature").textContent =
      Math.round(current.temperature_2m);
    document.getElementById("feelsLike").textContent =
      Math.round(current.apparent_temperature);
    document.getElementById("humidity").textContent =
      current.relative_humidity_2m + "%";
    document.getElementById("wind").textContent =
      current.wind_speed_10m + " km/h";
    document.getElementById("pressure").textContent =
      current.pressure_msl + " hPa";
    document.getElementById("cloud").textContent =
      current.cloud_cover + "%";

    result.hidden = false;
    status.textContent = "Weather updated successfully.";

    map.setView([place.latitude, place.longitude], 10);
    if (marker) marker.remove();
    marker = L.marker([place.latitude, place.longitude])
      .addTo(map)
      .bindPopup(place.name)
      .openPopup();

    setTimeout(() => map.invalidateSize(), 100);
  } catch (error) {
    status.textContent = error.message ||
      "Something went wrong. Please try again.";
  }
}

document.getElementById("weatherForm").addEventListener("submit", event => {
  event.preventDefault();
  const city = document.getElementById("cityInput").value.trim();
  if (city) searchWeather(city);
});

// Show Kolkata weather by default
searchWeather("Kolkata");
