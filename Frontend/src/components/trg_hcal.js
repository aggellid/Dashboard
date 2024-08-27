import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './styles.css'; // Import the CSS file

const TimeAggregator = ({ data }) => { 
    // Convert time components to milliseconds
    const convertToMilliseconds = (minutes, seconds, milliseconds) => {
        return (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000) + parseInt(milliseconds);
    };

    // Calculate total milliseconds from the data
    const calculateTotalMilliseconds = (data) => {
        return data.reduce((total, item) => {
            const { minutes, seconds, milliseconds } = item;
            return total + convertToMilliseconds(minutes, seconds, milliseconds);
        }, 0);
    };

    // Convert milliseconds back to minutes, seconds, milliseconds
    const convertBack = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return { minutes, seconds, milliseconds };
    };

    const totalMilliseconds = calculateTotalMilliseconds(data);
    const { minutes, seconds, milliseconds } = convertBack(totalMilliseconds);

    // Calculate percentage and prepare pie chart data
    const percentage = (totalMilliseconds * 100) / 3600000;
    const pieData = [
        { name: 'Rendement', value: percentage },
        { name: 'Repos', value: 100 - percentage }
    ];

    return (
        <div className="time-aggregator">
            <h3>Rendement Total par heure Sélectionné</h3>
            <p>{minutes} minutes, {seconds} seconds, {milliseconds} milliseconds</p>
            <br />
            <p>TRG par heure : {percentage} %</p>

            {/* Pie Chart */}
            <div className="pie-chart-container">
                <h3>Temps d'usage Par heure </h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            innerRadius={60}
                            fill="#8884d8"
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#36A2EB' : '#FF6384'} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default TimeAggregator;
