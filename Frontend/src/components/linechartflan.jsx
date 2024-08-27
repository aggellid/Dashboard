'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const LineChartComponent = () => {
  const [hourData, setHourData] = useState([]);

  useEffect(() => {
    const fetchHourCounts = async () => {
      try {
        const response = await axios.get('http://localhost:1000/nb_flan_h');
        const data = response.data;

        // Initialize the data for hours 6 to 13 with 0 counts
        const hoursRange = Array.from({ length: 8 }, (_, i) => ({
          hour: (i + 6).toString().padStart(2, '0'),
          count: 0,
        }));

        // Map the fetched data to the initialized hours range
        data.forEach((item) => {
          const hourIndex = parseInt(item.hour) - 6;
          if (hourIndex >= 0 && hourIndex < 8) {
            hoursRange[hourIndex].count = item.count;
          }
        });

        // Set the mapped data to the state
        setHourData(hoursRange.map((item) => ({
          name: `${item.hour}:00`,
          count: item.count,
        })));
      } catch (error) {
        console.error('Error fetching hour counts:', error);
      }
    };

    fetchHourCounts();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={hourData}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  );
};



const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          Count:
          <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};
export default LineChartComponent;