import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  CircularProgress,
  Box,
  Switch,
  Select,
  MenuItem,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudIcon from "@mui/icons-material/Cloud";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const CURRENT_WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [bgColor, setBgColor] = useState("#e3f2fd");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      background: {
        default: bgColor,
      },
    },
  });

  type ForecastResponse = {
    city: {
      name: string;
      country: string;
    };
    list: {
      dt: number;
      main: {
        temp: number;
        humidity: number;
      };
      weather: {
        description: string;
        icon: string;
      }[];
    }[];
  };

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const currentResponse = await axios.get(CURRENT_WEATHER_URL, {
        params: { q: city, appid: API_KEY, units: "metric" },
      });
      setCurrentWeather(currentResponse.data);

      const forecastResponse = await axios.get<ForecastResponse>(FORECAST_URL, {
        params: { q: city, appid: API_KEY, units: "metric" },
      });
      
      const dailyForecast = forecastResponse.data.list.reduce((acc: any[], item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!acc.some((entry) => entry.date === date)) {
          acc.push({ ...item, date });
        }
        return acc;
      }, []);
      
      setForecast({ city: forecastResponse.data.city, list: dailyForecast.slice(0, 10) });
    } catch (err: any) {
      setError("City not found. Please try again.");
      setCurrentWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5, backgroundColor: bgColor, p: 3, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
            <CloudIcon fontSize="large" /> Weather App
          </Typography>
          <Box display="flex" alignItems="center">
            <DarkModeIcon />
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <WbSunnyIcon />
          </Box>
        </Box>

        <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
          <TextField
            variant="outlined"
            label="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchWeather}
            sx={{ height: "56px" }}
            startIcon={<SearchIcon />}
          >
            Search
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" gap={2} sx={{ mb: 3 }}>
          <Typography variant="body1">Select Background Color:</Typography>
          <Select value={bgColor} onChange={(e) => setBgColor(e.target.value)}>
            <MenuItem value="#e3f2fd">Light Blue</MenuItem>
            <MenuItem value="#c8e6c9">Light Green</MenuItem>
            <MenuItem value="#ffccbc">Light Orange</MenuItem>
            <MenuItem value="#d1c4e9">Light Purple</MenuItem>
            <MenuItem value="#f5f5f5">Light Gray</MenuItem>
          </Select>
        </Box>

        {loading && <CircularProgress sx={{ mt: 2 }} />}

        {error && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {currentWeather && (
          <Card sx={{ p: 3, backgroundColor: "background.paper", textAlign: "center", mb: 3 }}>
            <CardContent>
              <Typography variant="h4">{currentWeather.name}, {currentWeather.sys.country}</Typography>
              <img
                src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
                alt="Weather Icon"
              />
              <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                {currentWeather.weather[0].description}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main" }}>
                {Math.round(currentWeather.main.temp)}°C
              </Typography>
              <Typography variant="body1">Humidity: {currentWeather.main.humidity}%</Typography>
              <Typography variant="body1">Wind Speed: {currentWeather.wind.speed} m/s</Typography>
            </CardContent>
          </Card>
        )}

        {forecast && (
          <Box sx={{ mt: 3, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
            {forecast.list.map((day: any, index: number) => (
              <Card key={index} sx={{ p: 2, backgroundColor: "background.paper", width: 200, textAlign: "center" }}>
                <CardContent>
                  <Typography variant="h6">{day.date}</Typography>
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                  <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
                    {day.weather[0].description}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: "bold", color: "primary.main" }}>
                    {Math.round(day.main.temp)}°C
                  </Typography>
                  <Typography variant="body1">Humidity: {day.main.humidity}%</Typography>
                  <Typography variant="body1">Wind Speed: {day.wind.speed} m/s</Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default Weather;
