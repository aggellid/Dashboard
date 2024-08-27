
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '/Users/MALEK/Desktop/dashboard1/src/data/data.css';

const MyComponent = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:1000/data');
                setData(response.data);
                console.log()
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }, []);

    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {data.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Machine_number</th>
                        <th>milling_program_name</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>process_cycle_time</th>
                        <th>Product_milling_time_start</th>
                        <th>Product_milling_time_end</th>
                        <th>cutter_diameter</th>
                        <th>spindle_rotation_speed</th>
                        <th>cutting_length</th>
                        <th>File_Name</th>

                        {/* Add other headers as needed */}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(item => (
                        <tr key={item.Machine_number}>
                            <td>{item.Machine_number}</td>
                            <td>{item.Miling_program_name}</td>
                            <td>{item.Date}</td>
                            <td>{item.Time}</td>
                            <td>{item.process_cycle_time}</td>
                            <td>{item.Product_miling_time_start}</td>
                            <td>{item.Product_miling_time_end}</td>
                            <td>{item.Cutter_diameter}</td>
                            <td>{item.Spindle_rotation_speed}</td>
                            <td>{item.Cutting_length}</td>
                            <td>{item.File_Name}</td>

                            {/* Add other data cells as needed */}
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

export default MyComponent;
