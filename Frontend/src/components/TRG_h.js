import React, { useState } from 'react';
import axios from 'axios';
import TimeAggregator from './trg_hcal'; 
import './styles.css'; // Import the CSS file

const TimeSelector = () => {
    const [timeVariable, setTimeVariable] = useState('06'); // Default value
    const [data, setData] = useState([]);

    const handleTimeChange = (event) => {
        setTimeVariable(event.target.value);
    };

    const submitTime = async () => {
        try {
            await axios.post('http://localhost:1000/set-time', { time: timeVariable });
            const response = await axios.get('http://localhost:1000/trg_h');
            setData(response.data); // Set the data state
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="time-selector">
            <label>
                Select Time:
                <input type="text" value={timeVariable} onChange={handleTimeChange} />
            </label>
            <button onClick={submitTime}>Submit</button>

            {/* Pass the data as a prop to TimeAggregator */}
            <TimeAggregator data={data} />
        </div>
    );
};

export default TimeSelector;
