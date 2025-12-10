import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    date: { type: Number, required: true },
    lat: { type: Number, default: 12.823 }, // default near SRM
    lng: { type: Number, default: 80.045 },

    // 🧭 Geospatial location
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        default: [80.045, 12.823],
      },
    },

    // ✅ Verification fields
    verified: { type: Boolean, default: false }, // for admin verification
    licenseNumber: { type: String, default: "" }, // optional license info
    verificationDoc: { type: String, default: "" }, // optional document URL
  },
  { minimize: false }
);

// ✅ Index for location-based queries
doctorSchema.index({ location: "2dsphere" });

const doctorModel =
  mongoose.models.doctor || mongoose.model("doctor", doctorSchema);

export default doctorModel;
