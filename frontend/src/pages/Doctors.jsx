import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import DoctorMap from "../components/DoctorMap";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="px-4 sm:px-8 py-6 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Find Your Doctor 🩺
      </h1>
      <p className="text-gray-600 mb-6 text-sm sm:text-base">
        Browse through specialists and book your appointment easily.
      </p>

      {/* 🔘 Filter Toggle for Mobile */}
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 border rounded-lg text-sm font-medium sm:hidden transition-all ${
            showFilter ? "bg-blue-600 text-white" : "bg-white text-gray-700"
          }`}
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* 🩺 Filter Menu */}
        <div
          className={`flex-col gap-3 text-sm text-gray-700 font-medium ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >
          {specialities.map((spec, i) => (
            <p
              key={i}
              onClick={() =>
                speciality === spec
                  ? navigate("/doctors")
                  : navigate(`/doctors/${spec}`)
              }
              className={`py-2 px-3 border rounded-lg w-[90vw] sm:w-auto cursor-pointer transition-all text-center sm:text-left ${
                speciality === spec
                  ? "bg-blue-100 border-blue-500 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {spec}
            </p>
          ))}
        </div>

        {/* 🧑‍⚕️ Doctors List */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* image header area - stable aspect, centered, small bg */}
<div className="w-full h-44 overflow-hidden bg-[#EAEFFF]">
  <img
    src={item.image}
    alt={item.name}
    className="w-full h-full object-cover object-center"
    style={ item.imagePosition ? { objectPosition: item.imagePosition } : {} }
    onError={(e) => {
      e.currentTarget.style.visibility = "hidden";
    }}
  />
</div>


                <div className="p-4 space-y-1">
                  {/* Availability */}
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      item.available ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.available ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></span>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>

                  {/* Name & Verified Badge */}
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-1">
                    {item.name}
                    {item.verified && (
                      <span className="text-green-600 text-xs font-semibold">
                        ✔ Verified
                      </span>
                    )}
                  </p>

                  <p className="text-gray-600 text-sm">{item.speciality}</p>
                  <p className="text-blue-600 font-semibold text-sm">
                    ₹{item.fees}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 mt-10 col-span-full">
              No doctors found for this category 😕
            </p>
          )}
        </div>
      </div>

      {/* 🗺️ Map Section */}
      <div className="mt-10">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
          Nearby Locations 🗺️
        </h2>
        <div className="h-[400px] sm:h-[500px] rounded-xl overflow-hidden shadow-md border border-gray-200">
          <DoctorMap doctors={filterDoc} />
        </div>
      </div>
    </div>
  );
};

export default Doctors;
