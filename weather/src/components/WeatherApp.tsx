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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloudIcon from "@mui/icons-material/Cloud";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

const Weather: React.FC = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API_URL, {
        params: { q: city, appid: API_KEY, units: "metric" },
      });
      setWeather(response.data);
    } catch (err: any) {
      setError("City not found. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
        <CloudIcon fontSize="large" /> Weather App
      </Typography>

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

      {loading && <CircularProgress sx={{ mt: 2 }} />}

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {weather && (
        <Card sx={{ mt: 3, p: 3, backgroundColor: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              {weather.name}, {weather.sys.country}
            </Typography>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather Icon"
            />
            <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
              {weather.weather[0].description}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: "bold", color: "#1565c0" }}>
              {Math.round(weather.main.temp)}°C
            </Typography>
            <Typography variant="body1">Humidity: {weather.main.humidity}%</Typography>
            <Typography variant="body1">Wind Speed: {weather.wind.speed} m/s</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default Weather;
