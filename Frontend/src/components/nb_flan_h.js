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

const LineCharts = () => {
  const [post1Data, setPost1Data] = useState([]);
  const [post2Data, setPost2Data] = useState([]);
  const [post3Data, setPost3Data] = useState([]);

  useEffect(() => {
    const fetchHourCounts = async () => {
      try {
        const response = await axios.get('http://localhost:1000/nb_flan_h');
        const data = response.data;

        // Initialize the data for the required hour ranges with 0 counts
        const post1Range = Array.from({ length: 8 }, (_, i) => ({
          hour: (i + 6).toString().padStart(2, '0'),
          count: 0,
        }));

        const post2Range = Array.from({ length: 8 }, (_, i) => ({
          hour: (i + 14).toString().padStart(2, '0'),
          count: 0,
        }));

        const post3Range = [
          ...Array.from({ length: 2 }, (_, i) => ({
            hour: (i + 22).toString().padStart(2, '0'),
            count: 0,
          })),
          ...Array.from({ length: 6 }, (_, i) => ({
            hour: (i).toString().padStart(2, '0'),
            count: 0,
          }))
        ];

        // Map the fetched data to the initialized hour ranges
        data.forEach((item) => {
          const hour = parseInt(item.hour);

          // Post 1: Hours 6 to 13
          if (hour >= 6 && hour <= 13) {
            const hourIndex = hour - 6;
            post1Range[hourIndex].count = item.count;
          }

          // Post 2: Hours 14 to 21
          if (hour >= 14 && hour <= 21) {
            const hourIndex = hour - 14;
            post2Range[hourIndex].count = item.count;
          }

          // Post 3: Hours 22 to 23 and 00 to 05
          if (hour >= 22 || hour <= 5) {
            const hourIndex = hour >= 22 ? hour - 22 : hour + 2;
            post3Range[hourIndex].count = item.count;
          }
        });

        // Set the mapped data to the state
        setPost1Data(post1Range.map((item) => ({
          name: `${item.hour}:00`,
          count: item.count,
        })));

        setPost2Data(post2Range.map((item) => ({
          name: `${item.hour}:00`,
          count: item.count,
        })));

        setPost3Data(post3Range.map((item) => ({
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
    <div>
      <h2>Post 1: Hours 6 to 13</h2>
      <Chart data={post1Data} />
      
      <h2>Post 2: Hours 14 to 21</h2>
      <Chart data={post2Data} />

      <h2>Post 3: Hours 22 to 23 and 00 to 05</h2>
      <Chart data={post3Data} />
    </div>
  );
};

const Chart = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{ right: 30 }}
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

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          Count: <span className="ml-2">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default LineCharts;
