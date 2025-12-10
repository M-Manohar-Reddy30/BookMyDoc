import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import { geocodeAddress } from "../utils/geocode.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";

// ✅ ADMIN LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET ALL APPOINTMENTS
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ CANCEL APPOINTMENT
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ ADD DOCTOR (Final Perfect Version)
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    // 1️⃣ Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // 2️⃣ Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid email format" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3️⃣ Check duplicate
    const existing = await doctorModel.findOne({ email: normalizedEmail });
    if (existing) {
      return res.json({
        success: false,
        message: "Email already registered. Use a different email.",
      });
    }

    // 4️⃣ Strong password
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be at least 8 characters long",
      });
    }

    // 5️⃣ Parse and sanitize address
    let parsedAddress = {};
    try {
      parsedAddress = typeof address === "string" ? JSON.parse(address) : address;

      for (let key in parsedAddress) {
        if (typeof parsedAddress[key] === "string") {
          parsedAddress[key] = parsedAddress[key]
            .replace(/["',]/g, "")
            .trim();
        }
      }
    } catch (err) {
      console.error("❌ Address parsing failed:", err.message);
      return res.json({
        success: false,
        message:
          'Invalid address format. Example: {"line1":"Apollo Hospital","city":"Hyderabad","state":"Telangana","country":"India"}',
      });
    }

    // 6️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 7️⃣ Upload image
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    // 🧭 Build full address string safely
    const formattedAddress = `${parsedAddress.line1 || ""}, ${parsedAddress.line2 || ""}, ${parsedAddress.city || ""}, ${parsedAddress.state || ""}, ${parsedAddress.country || ""}`.trim();

    console.log("🌍 Geocoding address:", formattedAddress);

    // 📍 Call the geocode util
    const geo = await geocodeAddress(formattedAddress);

    if (!geo || !geo.lat || !geo.lng) {
      console.warn("⚠️ Geocoding failed for:", formattedAddress);
      return res.json({
        success: false,
        message: `Could not find location for: ${formattedAddress}`,
      });
    }

    // 🩺 Prepare doctor data
    const doctorData = {
      name,
      email: normalizedEmail,
      image: imageUrl,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      lat: geo.lat,
      lng: geo.lng,
      location: {
        type: "Point",
        coordinates: [geo.lng, geo.lat],
      },
      available: true,
      date: Date.now(),
    };

    // 💾 Save Doctor
    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    console.log(`✅ Doctor Added: ${name} (${doctorData.lat}, ${doctorData.lng})`);
    res.json({ success: true, message: "Doctor Added Successfully" });
  } catch (error) {
    console.error("❌ addDoctor Error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ API to verify doctor
const verifyDoctor = async (req, res) => {
  try {
    const { docId } = req.body;
    const doctor = await doctorModel.findById(docId);
    if (!doctor) return res.json({ success: false, message: "Doctor not found" });

    doctor.verified = !doctor.verified; // toggle
    await doctor.save();
    res.json({ success: true, message: `Doctor ${doctor.verified ? "verified" : "unverified"}` });
  } catch (err) {
    console.log(err);
    res.json({ success: false, message: err.message });
  }
};

// ✅ DELETE DOCTOR
const deleteDoctor = async (req, res) => {
  try {
    console.log("🔍 DELETE Doctor API hit");
    console.log("📦 Request Body:", req.body);

    const { docId } = req.body;

    if (!docId) {
      return res.json({ success: false, message: "Doctor ID missing" });
    }

    const doctor = await doctorModel.findById(docId);
    if (!doctor) {
      return res.json({ success: false, message: "Doctor not found" });
    }

    // 🧹 Optional: Delete image from Cloudinary
    try {
      if (doctor.image && doctor.image.includes("cloudinary")) {
        const publicId = doctor.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (err) {
      console.log("⚠️ Cloudinary cleanup skipped:", err.message);
    }

    await doctorModel.findByIdAndDelete(docId);
    console.log(`🗑️ Deleted doctor: ${doctor.name}`);
    res.json({ success: true, message: `Dr. ${doctor.name} deleted successfully` });
  } catch (error) {
    console.error("❌ Delete doctor error:", error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ GET ALL DOCTORS
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, doctors });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ ADMIN DASHBOARD DATA
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patients: users.length,
      latestAppointments: appointments.reverse(),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addDoctor,
  allDoctors,
  adminDashboard,
  deleteDoctor,
  verifyDoctor,
};
