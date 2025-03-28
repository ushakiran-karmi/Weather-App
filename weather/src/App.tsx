import React from "react";
import Weather from "./components/WeatherApp";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Weather />
    </ThemeProvider>
  );
};

export default App;
