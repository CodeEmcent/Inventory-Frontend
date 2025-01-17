import React, { useState } from "react";

const Heading = ({ title, subtitle }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Handle showing/hiding the dropdown on hover
  const handleMouseEnter = () => setIsDropdownVisible(true);
  const handleMouseLeave = () => setIsDropdownVisible(false);

  return (
    <div className="heading">
      <h1 
        onMouseEnter={handleMouseEnter} 
        onMouseLeave={handleMouseLeave}
      >
        {title}
      </h1>
      {/* Dropdown content */}
      {subtitle && (
        <div 
          className={`dropdown-content ${isDropdownVisible ? "show" : ""}`}
        >
          <p>{subtitle}</p>
        </div>
      )}
    </div>
  );
}

export default Heading;
