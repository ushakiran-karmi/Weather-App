import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const WeatherCard: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Card sx={{ p: 3, textAlign: "center", mb: 3 }}>
      <CardContent>
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
