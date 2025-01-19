import React, { useState } from "react";
import "./header.css";
import { nav } from "../../data/Data";
import { Link } from "react-router-dom";

const Header = () => {
  const [navList, setNavList] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null); // Track which nav item is being hovered

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
                  onMouseEnter={() => setHoveredNav(index)} // Set hovered nav
                  onMouseLeave={() => setHoveredNav(null)} // Reset hovered nav
                >
                  <Link to={list.path}>{list.text}</Link>
                  {/* Conditionally render the description text for 'services' */}
                  {hoveredNav === index && list.description && (
                    <div className="secondary-nav-text">
                      <p>{list.description}</p>
                    </div>
                  )}
                  {/* If the nav item has dropdown items */}
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
            <Link to="/login">
              <button className="btn1">
                <i className="fa fa-sign-in"></i> Sign In
              </button>
            </Link>
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