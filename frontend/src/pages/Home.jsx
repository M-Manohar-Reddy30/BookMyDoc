import React from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";

const Home = () => {
  return (
    <div className="overflow-x-hidden bg-gray-50">
      {/* ✅ All sections inside padding */}
      <div className="px-4 sm:px-6 md:px-10">
        <Header />
        <SpecialityMenu />
        <TopDoctors />
        <Banner />
      </div>
    </div>
  );
};

export default Home;
