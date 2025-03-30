import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const ForecastCard: React.FC<{ data: any }> = ({ data }) => {
  return (
    <Box sx={{ display: "flex", overflowX: "auto", gap: 2 }}>
      {data.list.slice(0, 7).map((day: any, index: number) => (
        <Card key={index} sx={{ p: 2, width: 150, textAlign: "center" }}>
          <CardContent>
            <Typography variant="h6">{new Date(day.dt * 1000).toLocaleDateString()}</Typography>
            <Typography variant="subtitle2">{new Date(day.dt * 1000).toLocaleTimeString()}</Typography>
            <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} alt="Weather Icon" />
            <Typography>{day.weather[0].description}</Typography>
            <Typography variant="h5">{Math.round(day.main.temp)}°C</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ForecastCard;
