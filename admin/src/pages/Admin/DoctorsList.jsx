import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import api from '../../utils/api';

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors, backendUrl } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

// Delete doctor
const handleDeleteDoctor = async (id, name) => {
  if (!window.confirm(`Are you sure you want to delete Dr. ${name}?`)) return;
  try {
    const { data } = await api.post('/api/admin/delete-doctor', { docId: id });
    if (data.success) {
      toast.success(`Dr. ${name} deleted successfully`);
      getAllDoctors();
    } else toast.error(data.message);
  } catch (error) {
    console.error("Delete doctor error:", error.response ?? error);
    toast.error("Failed to delete doctor");
  }
};

// Verify doctor
const handleVerifyDoctor = async (id, name) => {
  try {
    const { data } = await api.post('/api/admin/verify-doctor', { docId: id });
    if (data.success) {
      toast.success(`Dr. ${name} ${data.message}`);
      getAllDoctors();
    } else toast.error(data.message);
  } catch (err) {
    console.error("Verify error:", err.response ?? err);
    toast.error(`Verification failed: ${err.response?.data?.message || err.message}`);
  }
};


  return (
    <div className="m-3 sm:m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-800">
        All Doctors
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pt-2">
        {doctors.map((item, index) => (
          <div
            key={index}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <img
              className="w-full h-44 object-cover bg-[#EAEFFF] group-hover:opacity-90 transition"
              src={item.image}
              alt={item.name}
            />

            <div className="p-4 flex flex-col justify-between min-h-[210px]">
              {/* Doctor Name */}
              <p className="text-[#262626] text-base sm:text-lg font-semibold flex items-center gap-1 flex-wrap">
                {item.name}
                {item.verified && (
                  <span className="text-green-600 text-xs sm:text-sm font-semibold">
                    ✔ Verified
                  </span>
                )}
              </p>

              {/* Speciality */}
              <p className="text-[#5C5C5C] text-sm mb-1 truncate">
                {item.speciality}
              </p>

              {/* Availability */}
              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  className="cursor-pointer accent-blue-500"
                />
                <p className="text-gray-600">Available</p>
              </div>

              {/* Verify Button */}
              <button
                onClick={() => handleVerifyDoctor(item._id, item.name)}
                className={`mt-3 w-full py-2 rounded-md text-sm font-medium transition-all
                  ${
                    item.verified
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-300 hover:bg-gray-400 text-black"
                  }`}
              >
                {item.verified ? "Verified ✓" : "Verify Doctor"}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteDoctor(item._id, item.name)}
                className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm font-medium transition-all"
              >
                Delete Doctor
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
