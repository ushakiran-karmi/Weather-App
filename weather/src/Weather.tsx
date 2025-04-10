import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherChart from "./components/WeatherChart";
import Alert from "./components/Alert";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

interface WeatherProps {
  isDarkMode: boolean;
}

interface WeatherResponse {
  weather: { main: string }[];
  main: {
    temp: number;
    humidity: number;
  };
  name: string;
}

interface ForecastResponse {
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { main: string }[];
  }[];
}

const Weather: React.FC<WeatherProps> = ({ isDarkMode }) => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'error' | 'warning' | 'info'>('info');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const weatherBackgrounds: { [key: string]: string } = {
    Clear: "C:/Users/Lenovo/OneDrive/Desktop/File Upload/Weather App/weather/public/sky.jpg",
    Clouds: "C:/Users/Lenovo/OneDrive/Desktop/File Upload/Weather App/weather/public/Cloudy.jpg",
    Rain: "C:/Users/Lenovo/OneDrive/Desktop/File Upload/Weather App/weather/public/Rainy",
    Snow: "C:/Users/Lenovo/OneDrive/Desktop/File Upload/Weather App/weather/public/Snow.jpg",
    Thunderstorm: "C:/Users/Lenovo/OneDrive/Desktop/File Upload/Weather App/weather/public/Thunderstorm.jpg",
    Mist: "https://source.unsplash.com/800x600/?mist",
    Default: "https://source.unsplash.com/800x600/?weather",
  };

  const getAlertForWeather = (weatherType: string, temp: number): { type: 'error' | 'warning' | 'info', message: string } | null => {
    if (weatherType === "Thunderstorm") {
      return { type: "warning", message: "⛈️ Severe thunderstorm warning! Stay indoors." };
    }
    if (weatherType === "Rain") {
      return { type: "info", message: "🌧️ It might rain soon. Don't forget your umbrella!" };
    }
    if (weatherType === "Snow") {
      return { type: "info", message: "❄️ Snowy weather expected. Dress warmly!" };
    }
    if (temp > 35) {
      return { type: "warning", message: "🔥 It's extremely hot today. Stay hydrated!" };
    }
    if (weatherType === "Mist") {
      return { type: "info", message: "🌫️ Misty conditions. Drive safely!" };
    }
    return null;
  };

  const fetchWeather = async (location: string | { lat: number; lon: number }) => {
    setLoading(true);
    setError("");
    setAlertMessage("");

    try {
      const params =
        typeof location === "string"
          ? { q: location, appid: API_KEY, units: "metric" }
          : { lat: location.lat, lon: location.lon, appid: API_KEY, units: "metric" };

      const { data: currentData } = await axios.get<WeatherResponse>(CURRENT_WEATHER_URL, { params });
      setCurrentWeather(currentData);

      const { data: forecastData } = await axios.get<ForecastResponse>(FORECAST_URL, { params });
      setForecast(forecastData);

      const weatherType = currentData.weather[0]?.main || "Default";
      const temp = currentData.main?.temp;

      setBgImage(weatherBackgrounds[weatherType] || weatherBackgrounds["Default"]);

      const alert = getAlertForWeather(weatherType, temp);
      if (alert) {
        setAlertType(alert.type);
        setAlertMessage(alert.message);
      }
    } catch (err) {
      setError("City not found. Please try again.");
      setAlertType("error");
      setAlertMessage("City not found. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        fetchWeather({ lat: position.coords.latitude, lon: position.coords.longitude }),
      () => {
        setError("Unable to retrieve your location.");
        setAlertType("error");
        setAlertMessage("Unable to retrieve your location.");
      }
    );
  };

  return (
    <Container
      sx={{
        textAlign: "center",
        mt: 5,
        p: 3,
        borderRadius: 2,
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "90vh",
        color: isDarkMode ? "white" : "black",
        transition: "background 0.5s ease-in-out",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>
        Current Time: {currentTime.toLocaleTimeString()}
      </Typography>

      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")}
        />
      )}

      <Box display="flex" justifyContent="center" gap={2}>
        <TextField
          variant="outlined"
          label="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={() => fetchWeather(city)} startIcon={<SearchIcon />}>
          Search
        </Button>
        <Button variant="contained" color="secondary" onClick={fetchWeatherByLocation} startIcon={<MyLocationIcon />}>
          Use My Location
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {error && <Typography color="error">{error}</Typography>}

      {currentWeather && <WeatherCard data={currentWeather} />}
      {forecast && <ForecastCard data={forecast} />}
      {forecast && <WeatherChart data={forecast} />}
    </Container>
  );
};

export default Weather;
