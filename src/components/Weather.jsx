import React, { useState, useEffect } from "react";
import { Sun, CloudDrizzle, Droplets, Wind, Search, Cloud } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Weather.css";
const Weather = () => {
  const [city, setCity] = useState("Mumbai");
  const [temperatureData, setTemperatureData] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherInfo, setWeatherInfo] = useState({
    humidity: 75,
    windSpeed: 7,
    precipitation: 0,
    description: "Hot"
  });
useEffect(() => {
    const mockTemps=[28, 27.5, 27, 26.5, 29, 31.5, 33, 32.5, 31, 29, 28, 27.5];
    const mockLabels = ["00:00", "02:00", "04:00", "06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];
    setTemperatureData(mockTemps);
    setTimeLabels(mockLabels);
},[]);

  const getCoordinates = async (cityName) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${cityName}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length === 0) {
      throw new Error("City not found. Please check the spelling.");
    }
    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  };
  const fetchWeatherData = async (lat, lon) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  const processWeatherData = (data) => {
    const labels = data.hourly.time.slice(0, 24).map((t) => {
      const time = t.split("T")[1].slice(0, 5);
      return time;
    });

    const temps = data.hourly.temperature_2m.slice(0, 24);
    const humidity = data.hourly.relative_humidity_2m ?
      data.hourly.relative_humidity_2m.slice(0, 24).reduce((a, b) => a + b, 0) / 24 :
      0;
    const windSpeed = data.hourly.wind_speed_10m ?
      data.hourly.wind_speed_10m.slice(0, 24).reduce((a, b) => a + b, 0) / 24 :
      0;
    const precipitation = data.hourly.precipitation ?
      data.hourly.precipitation.slice(0, 24).reduce((a, b) => a + b, 0) :
      0;
    let description = "Clear";
    if (precipitation > 2) description = "Rainy";
    else if (humidity > 80) description = "Humid";
    else if (windSpeed > 20) description = "Windy";
    else if (Math.max(...temps) > 30) description = "Hot";
    else if (Math.min(...temps) < 10) description = "Cold";
    else description = "Moderate";

    return {
      labels,
      temps,
      weatherInfo: {
        humidity: Math.round(humidity),
        windSpeed: Math.round(windSpeed),
        precipitation: Math.round(precipitation * 10) / 10,
        description
      }
    };
  };

  const handleFetchWeather = async () => {
    setError("");
    setLoading(true);
    try {
      if (!city) throw new Error("Please enter a city name.");
      const { latitude, longitude } = await getCoordinates(city);
      const weatherData = await fetchWeatherData(latitude, longitude);
      if (!weatherData.hourly || !weatherData.hourly.time || !weatherData.hourly.temperature_2m) {
        throw new Error("Weather data not available for this location.");
      }
      const { labels, temps, weatherInfo } = processWeatherData(weatherData);
      if (labels.length === 0 || temps.length === 0) {
        throw new Error("Empty weather data received.");
      }

      setTemperatureData(temps);
      setTimeLabels(labels);
      setWeatherInfo(weatherInfo);
      console.log("Weather data fetched successfully:", weatherInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFetchWeather();
    }
  };

  const WeatherIcon = ({ condition }) => {
    switch (condition.toLowerCase()) {
      case 'hot':
        return <Sun className="icon hot" />;
      case 'rainy':
        return <CloudDrizzle className="icon rainy" />;
      case 'humid':
        return <Droplets className="icon humid" />;
      case 'windy':
        return <Wind className="icon windy" />;
      case 'cold':
        return <CloudDrizzle className="icon cold" />;
      default:
        return <Cloud className="icon default" />;
    }
  };

  const TemperatureChart = ({ data, labels }) => {
    if (!data || data.length === 0) return null;

    const min = Math.min(...data) - 1;
    const max = Math.max(...data) + 1;
    const range = max - min;

    const width = 400;
    const height = 150;
    const padding = { top: 20, right: 30, bottom: 40, left: 40 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const points = data.map((temp, i) => {
      const x = (i / (data.length - 1)) * chartWidth + padding.left;
      const y = chartHeight - ((temp - min) / range) * chartHeight + padding.top;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding.left},${chartHeight + padding.top} ${points} ${chartWidth + padding.left},${chartHeight + padding.top}`;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="chart">
        <line x1={padding.left} y1={padding.top} x2={padding.left} y2={chartHeight + padding.top} stroke="#ccc" strokeWidth="1" />
        <line x1={padding.left} y1={chartHeight + padding.top} x2={chartWidth + padding.left} y2={chartHeight + padding.top} stroke="#ccc" strokeWidth="1" />

        {[...Array(5)].map((_, i) => {
          const temp = min + (range / 4) * i;
          const y = chartHeight - (i / 4) * chartHeight + padding.top;
          return (
            <g key={i}>
              <line x1={padding.left - 5} x2={padding.left} y1={y} y2={y} stroke="#ccc" strokeWidth="1" />
              <text x={padding.left - 10} y={y + 5} textAnchor="end" fontSize="10" fill="#666">{Math.round(temp)}°C</text>
            </g>
          );
        })}

        {labels.map((label, i) => {
          if (i % 2 === 0 || labels.length <= 12) {
            const x = (i / (labels.length - 1)) * chartWidth + padding.left;
            return (
              <text key={i} x={x} y={chartHeight + padding.top + 20} textAnchor="middle" fontSize="10" fill="#666">{label}</text>
            );
          }
          return null;
        })}

        <polygon points={areaPoints} fill="rgba(37, 99, 235, 0.1)" />
        <polyline points={points} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((temp, i) => {
          const x = (i / (data.length - 1)) * chartWidth + padding.left;
          const y = chartHeight - ((temp - min) / range) * chartHeight + padding.top;
          return <circle key={i} cx={x} cy={y} r="3" fill="#2563eb" />;
        })}
      </svg>
    );
  };

  return (
    <div className="weather-container container text-center py-4">
      <div className="d-flex flex-column align-items-center mb-4">
        <h1 className="weather-title mb-3">Weather Forecast (24H)</h1>
        <div className="search-bar d-flex w-100 justify-content-center" style={{ maxWidth: '400px' }}>
          <input
            type="text"
            placeholder="Enter city name"
            className="form-control rounded-4"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn btn-primary rounded-3 "
            onClick={handleFetchWeather}
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="main-content">
        <div className="weather-info d-flex justify-content-center flex-wrap gap-4 mb-4">
          <div className="weather-card card p-3">
            <WeatherIcon condition={weatherInfo.description} />
        
            <div>
              <div className="label">Condition</div>
              <div className="value fw-bold">{weatherInfo.description}</div>
            </div>
          </div>
          <div className="weather-card card p-3">
            <Droplets className="icon humid" />
            <div>
              <div className="label">Humidity</div>
              <div className="value fw-bold">{weatherInfo.humidity}%</div>
            </div>
          </div>
          <div className="weather-card card p-3">
            <Wind className="icon windy"/>
            <div>
              <div className="label">Wind Speed</div>
              <div className="value fw-bold">{weatherInfo.windSpeed} km/h</div>
            </div>
          </div>
          <div className="weather-card card p-3">
            <CloudDrizzle className="icon rainy" />
            <div>
              <div className="label">Precipitation</div>
              <div className="value fw-bold">{weatherInfo.precipitation} mm</div>
            </div>
          </div>
        </div>

        <div className="temperature-chart d-flex justify-content-center">
          <TemperatureChart data={temperatureData} labels={timeLabels} />
        </div>
      </div>
    </div>
  );
};

export default Weather;
