import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import Heading from "../../common/Heading";
import "./hero.css";

const Hero = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleGetStartedClick = () => {
    navigate("/register"); // Navigate to the "Get Started" page
  };

  return (
    <>
      <section className='hero'>
        <div className='container'>
          <Heading
            title={<><span>Emcent</span><span className="highlighted-text"> Vault</span></>}
            subtitle='For your innovative and seamless inventory solution that helps you to streamline your business records.
              Our Solution is designed to remove the hassle of manually aggregating the entire items in various departments/offices within an organization.'
          />
          <button className="get-started-btn" onClick={handleGetStartedClick}>
            Get Started
          </button>
        </div>
      </section>
    </>
  );
};

export default Hero;
