import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline, Box, Switch } from "@mui/material";
import Weather from "./Weather";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const GEOLOCATION_URL = "https://api.openweathermap.org/data/2.5/weather";

// Define the expected response structure
interface WeatherResponse {
  weather: { main: string }[];
}

const getBackgroundImage = (weatherCondition: string, isDarkMode: boolean) => {
  if (isDarkMode) return "/night-sky.jpg"; // Default night mode background

  switch (weatherCondition) {
    case "Clear":
      return "/Fallback sky background.jpg";
    case "Clouds":
      return "/Cloudy.jpg";
    case "Rain":
      return "/Rainy.jpg";
    case "Snow":
      return "/Snow.jpg";
    case "Thunderstorm":
      return "/Thunderstorm.jpg";
    case "Sunny":
      return "/sunny.jpg";
    default:
      return "/sky.jpg";
  }
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("/sky.jpg");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await axios.get<WeatherResponse>(GEOLOCATION_URL, {
            params: { lat: latitude, lon: longitude, appid: API_KEY, units: "metric" },
          });

          if (response.data && response.data.weather) {
            const weatherCondition = response.data.weather[0].main;
            setBackgroundImage(getBackgroundImage(weatherCondition, darkMode));
          }
        } catch (error) {
          console.error("Error fetching weather data:", error);
        }
      },
      (error) => {
        console.error("Geolocation Error:", error);
      }
    );
  }, [darkMode]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-image 1s ease-in-out",
        }}
      >
        {/* Dark Mode Toggle */}
        <Box display="flex" alignItems="center" justifyContent="center" mt={2} gap={1}>
          <WbSunnyIcon color="warning" />
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <DarkModeIcon color="action" />
        </Box>

        {/* Weather App Component */}
        <Weather isDarkMode={darkMode} />
      </Box>
    </ThemeProvider>
  );
};

export default App;
