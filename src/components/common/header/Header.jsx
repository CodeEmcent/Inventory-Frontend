import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; // Import the useAuth hook
import "./header.css";
import { nav } from "../../data/Data";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const { isLoggedIn, logout } = useAuth(); // Use context to get login status and logout function
  const navigate = useNavigate(); // For navigation after logging out

  const handleSignOut = () => {
    logout(); // Call the logout function from the context
    navigate("/"); // Redirect to the homepage or wherever after sign out
  };

  return (
    <>
      <header>
        <div className="container flex">
          <div className="logo">
            <img src="./images/logo.png" alt="" />
          </div>
          <div className="nav">
            <ul className={navList ? "small" : "flex"}>
              {nav.map((list, index) => (
                <li
                  key={index}
                  className={list.dropdown ? "dropdown" : ""}
                  onMouseEnter={() => setHoveredNav(index)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  <Link to={list.path}>{list.text}</Link>
                  {hoveredNav === index && list.description && (
                    <div className="secondary-nav-text">
                      <p>{list.description}</p>
                    </div>
                  )}
                  {list.dropdown && (
                    <ul className="dropdown-menu">
                      <p>Our services cover these industries and more...</p>
                      {list.dropdown.map((dropdownItem, subIndex) => (
                        <li key={subIndex}>
                          <Link to={dropdownItem.path}>{dropdownItem.text}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="button flex">
            {/* Conditionally render the Sign In or Sign Out button */}
            {isLoggedIn ? (
              <button className="btn1" onClick={handleSignOut}>
                <i className="fa fa-sign-out"></i> Sign Out
              </button>
            ) : (
              <Link to="/login">
                <button className="btn1">
                  <i className="fa fa-sign-in"></i> Sign In
                </button>
              </Link>
            )}
          </div>

          <div className="toggle">
            <button onClick={() => setNavList(!navList)}>
              {navList ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
