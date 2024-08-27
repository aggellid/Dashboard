import React from 'react';
import {Link } from 'react-router-dom' ; 
import './fancybutton.css'; // file for styling
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";

const FancyButtons = () => {
    return (
        <div className="fancy-buttons">
            <Link to='/bar'>
            <span></span><span></span><span></span><span></span>
            <button className="fancy-btn"> <BarChartOutlinedIcon/> Le TRG par poste </button>
            </Link>
            <Link to='/pie'>
            <button className="fancy-btn">  <PieChartOutlineOutlinedIcon/> Le TRG par heure </button>
            </Link>
            <Link to='/form'>
            <button className="fancy-btn"> <TimelineOutlinedIcon/> le Nombre flan par poste  </button>
            </Link>
            <Link to='/lineflan_h'>
            <button className="fancy-btn"> <BarChartOutlinedIcon/>  Le Nombre flan  par heure </button>
            </Link>

        </div>
    );
};

export default FancyButtons;
