'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Barflan = () => {
  const [data, setData] = useState([
    { name: 'Post 1', total: 0 },
    { name: 'Post 2', total: 0 },
    { name: 'Post 3', total: 0 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:1000/total-counts');
        const totals = response.data;
        setData([
          { name: 'Post 1', total: totals.post1Total },
          { name: 'Post 2', total: totals.post2Total },
          { name: 'Post 3', total: totals.post3Total },
        ]);
      } catch (error) {
        console.error('Error fetching totals:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
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
        <Bar dataKey="total" fill="#2563eb" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          Total:
          <span className="ml-2">Flan{payload[0].value}</span>
        </p>
      </div>
    );
  }

  return null;
};

export default Barflan;

