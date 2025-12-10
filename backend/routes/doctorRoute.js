import express from 'express';
import { loginDoctor, appointmentsDoctor, appointmentCancel, doctorList, changeAvailablity, appointmentComplete, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js';
import authDoctor from '../middleware/authDoctor.js';
const doctorRouter = express.Router();
import doctorModel from "../models/doctorModel.js";

doctorRouter.post("/login", loginDoctor)
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel)
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor)
doctorRouter.get("/list", doctorList)
doctorRouter.post("/change-availability", authDoctor, changeAvailablity)
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete)
doctorRouter.get("/dashboard", authDoctor, doctorDashboard)
doctorRouter.get("/profile", authDoctor, doctorProfile)
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile)

// ✅ Nearby doctors route
doctorRouter.get("/nearby", async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.json({ success: false, message: "Invalid coordinates" });
    }

    const R = 6371; // Earth radius in km

    const doctors = await doctorModel.find({});
    const nearbyDoctors = doctors.filter((doc) => {
      if (!doc.lat || !doc.lng) return false;
      const dLat = (doc.lat - lat) * (Math.PI / 180);
      const dLng = (doc.lng - lng) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat * (Math.PI / 180)) *
          Math.cos(doc.lat * (Math.PI / 180)) *
          Math.sin(dLng / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      return distance <= radius; // default radius: 10 km
    });

    res.json({ success: true, doctors: nearbyDoctors });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
});

export default doctorRouter;