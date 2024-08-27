import React, { useState } from 'react';
import axios from 'axios';
import { getTodayDate, getTomorrowDate } from './todaydate'; 

const Trgpost = () => {
    const [post1Total, setPost1Total] = useState(0);
    const [post2Total, setPost2Total] = useState(0);
    const [post3And4Total, setPost3And4Total] = useState(0);
    const [totalMilliseconds, setTotalMilliseconds] = useState(0);

    const fetchRange = async (start, end, date) => {
        let total = 0;
        for (let i = start; i <= end; i++) {
            const timeVariable = i.toString().padStart(2, '0'); // Format with leading zero 

            // Set the time variable
            await axios.post('http://localhost:1000/set-time', { time: timeVariable });

            // Fetch data from /trg_h endpoint
            const response = await axios.get('http://localhost:1000/trg_h', {
                params: { date } // Pass date as a query parameter if needed
            });
            const fetchedData = response.data;

            // Calculate total milliseconds from the data
            const calculateTotalMilliseconds = (data) => {
                const convertToMilliseconds = (minutes, seconds, milliseconds) => {
                    return (parseInt(minutes) * 60000) + (parseInt(seconds) * 1000) + parseInt(milliseconds);
                };
                return data.reduce((total, item) => {
                    const { minutes, seconds, milliseconds } = item;
                    return total + convertToMilliseconds(minutes, seconds, milliseconds);
                }, 0);
            };

            total += calculateTotalMilliseconds(fetchedData);
        }
        return total;
    };

    const fetchAndCalculate = async () => {
        try {
            const today = getTodayDate();
            const tomorrow = getTomorrowDate(); 

            // Post 1: From '06' to '14'
            const post1Total = ((await fetchRange(6, 14, today)*100)/3600000)/8;
            setPost1Total(post1Total);

            // Post 2: From '15' to '21'
            const post2Total = ((await fetchRange(15, 21, today)*100)/3600000)/8;
            setPost2Total(post2Total);

            // Post 3 + Post 4: From '22' to '23' today and '00' to '05' tomorrow
            const post3Total = await fetchRange(22, 23, today);
            const post4Total = await fetchRange(0, 5, tomorrow);
            const combinedPost3And4Total = post3Total + post4Total;
            setPost3And4Total(((combinedPost3And4Total*100)/3600000)/8);

            // Calculate total milliseconds
            const total = post1Total + post2Total + combinedPost3And4Total;
            setTotalMilliseconds(total);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Convert milliseconds back to minutes, seconds, milliseconds
    const convertBack = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = ms % 1000;
        return { minutes, seconds, milliseconds };
    };

    const { minutes, seconds, milliseconds } = convertBack(totalMilliseconds);

    return (
        <div>
            <button onClick={fetchAndCalculate}>Fetch and Calculate Time </button>

            <div>
                <h3>Total Time</h3>
                <p>Post 1 (06 to 14): {post1Total} %</p>
                <p>Post 2 (14 to 21): {post2Total} %</p>
                <p>Post 3  (22 to 23 today and 00 to 05 tomorrow): {post3And4Total} %</p>
                <p>Total Time: {minutes} minutes, {seconds} seconds, {milliseconds} milliseconds</p>
                <p>Total milliseconds: {totalMilliseconds}</p>
            </div>
        </div>
    );
};

export default Trgpost;
