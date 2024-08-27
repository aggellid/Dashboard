/*// MenuComponent.js
import React from 'react';
import PreviewMyComponent from '';
import PreviewTimeSelector from './PreviewTimeSelector'; // Create similar preview components
import PreviewBarChart from './PreviewBarChart';
// Import other preview components

const menuItems = [
  { label: 'Data', Preview: PreviewMyComponent },
  { label: 'Pie Chart', Preview: PreviewTimeSelector },
  { label: 'Bar Chart', Preview: PreviewBarChart },
  // Add other items
];

const MenuComponent = () => {
  return (
    <div className="menu-container">
      {menuItems.map((item, index) => (
        <div key={index} className="menu-item">
          <item.Preview />
          <div>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MenuComponent;*/
