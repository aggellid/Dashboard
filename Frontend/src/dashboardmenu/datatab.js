import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './data.css'; // Ensure path is correct

const MiniTable = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:1000/data');
                setData(response.data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    const handleClick = () => {
        navigate('/data'); // Navigate to /data on click
    };

    if (error) return <div>Error: {error}</div>;

    return (
        
        <div className="mini-table-container" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <h2 className="mini-table-title">Données D'aujourd'hui</h2> 
        {data.length > 0 ? (
            <table className="mini-table">
                <thead>
                    <tr>
                        <th>Machine_number</th>
                        <th>Program_name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Cycle_time</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice(0, 5).map(item => (
                        <tr key={item.Machine_number}>
                            <td>{item.Machine_number}</td>
                            <td>{item.Miling_program_name}</td>
                            <td>{item.Date}</td>
                            <td>{item.Time}</td>
                            <td>{item.process_cycle_time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p>No data available</p>
        )}
    </div>
);
};

export default MiniTable;
