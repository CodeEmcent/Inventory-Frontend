import React from "react"
import Header from "../common/header/Header"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "../home/Home"
import Footer from "../common/footer/Footer"
import About from "../about/About"
import Services from "../services/Services"
import Contact from "../contact/Contact"

import Login from "../../pages/Login";
import Register from "../../pages/Register";

const Pages = () => {
  return (
    <>
      <Router>
        
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/services' element={<Services />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default Pages
