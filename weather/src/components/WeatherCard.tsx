import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import AlertMessage from "./AlertMessage";

const WeatherCard: React.FC<{ data: any; alertMessage?: string; alertSeverity?: "error" | "warning" | "info" | "success" }> = ({
  data,
  alertMessage,
  alertSeverity = "info",
}) => {
  return (
    <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
      <CardContent>
        {alertMessage && (
          <AlertMessage
            message={alertMessage}
            severity={alertSeverity}
            onClose={() => {}}
          />
        )}

        <Typography variant="h4">{data.name}, {data.sys.country}</Typography>
        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="Weather Icon" />
        <Typography variant="h5">{data.weather[0].description}</Typography>
        <Typography variant="h3">{Math.round(data.main.temp)}°C</Typography>
        <Typography>Humidity: {data.main.humidity}%</Typography>
        <Typography>Wind Speed: {data.wind.speed} m/s</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
