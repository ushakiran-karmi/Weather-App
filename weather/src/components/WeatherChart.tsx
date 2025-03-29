import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const WeatherChart: React.FC<{ data: any }> = ({ data }) => {
  const chartData = data.list.map((entry: any) => ({
    time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    temp: entry.main.temp,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeatherChart;
