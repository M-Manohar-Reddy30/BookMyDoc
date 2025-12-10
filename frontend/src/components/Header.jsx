import React from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion"; // Animation library
import group_profiles from "../assets/group_profiles.png";
import header_img from "../assets/header_img.png";

const Header = () => {
  return (
    // 🌈 Animated Wrapper with Gradient Background
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl flex flex-col md:flex-row items-center justify-between px-4 sm:px-10 lg:px-20 py-8 md:py-16 shadow-lg bg-primary"
    >
      {/* 🔮 Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-primary to-purple-500 animate-gradient rounded-2xl opacity-90 -z-10"></div>

      {/* -------- LEFT SECTION -------- */}
      <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-5 z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
          Book Appointments <br /> With{" "}
          <span className="text-yellow-300">Trusted Doctors</span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-white text-sm sm:text-base">
          <img 
  src={group_profiles} 
  style={{ width: 120, }}
  alt="test"
/>

          <p className="max-w-md opacity-90">
            Browse our extensive list of verified doctors <br className="hidden sm:block" />
            and book your appointment in seconds.
          </p>
        </div>

        {/* 🎯 Animated CTA Button */}
        <motion.a
          href="#speciality"
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-white text-primary font-semibold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
        >
          Book Appointment
          <img className="w-3" src={assets.arrow_icon} alt="Arrow" />
        </motion.a>
      </div>

      {/* -------- RIGHT SECTION -------- */}
      <div className="md:w-1/2 flex justify-center md:justify-end mt-8 md:mt-0 relative">
        <img 
  src={header_img} 
  style={{ width: 1020,  }}
  alt="test"
/>
  </div>      

      {/* Soft Gradient Overlay for Mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent md:hidden rounded-2xl"></div>
    </motion.div>
  );
};

export default Header;
