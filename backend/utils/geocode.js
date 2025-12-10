import axios from "axios";

// 🌍 Reliable geocoding with fallback and cleaning
export const geocodeAddress = async (address) => {
  if (!address) return { lat: 12.823, lng: 80.045 }; // default SRM Chennai

  try {
    // Clean the address string
    const cleanAddress = address
      .replace(/[,]+/g, ",")
      .replace(/\s+/g, " ")
      .trim();

    console.log("🌍 Geocoding with Nominatim:", cleanAddress);

    // Try Nominatim (OpenStreetMap)
    const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanAddress)}&limit=1`;

    const { data } = await axios.get(nominatimURL, {
      headers: { "User-Agent": "PrescriptoApp/1.0" },
      timeout: 7000,
    });

    if (data && data.length > 0) {
      const lat = parseFloat(data[0].lat);
      const lng = parseFloat(data[0].lon);
      console.log("✅ Found via Nominatim:", lat, lng);
      return { lat, lng };
    }

    console.warn("⚠️ Nominatim failed, trying fallback OpenCage...");
    // Fallback: OpenCageData (optional — use your key if you have one)
    const opencageKey = process.env.OPENCAGE_API_KEY;
    if (opencageKey) {
      const ocURL = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        cleanAddress
      )}&key=${opencageKey}&limit=1`;

      const res = await axios.get(ocURL, { timeout: 7000 });
      if (res.data.results.length > 0) {
        const lat = res.data.results[0].geometry.lat;
        const lng = res.data.results[0].geometry.lng;
        console.log("✅ Found via OpenCage:", lat, lng);
        return { lat, lng };
      }
    }

    console.warn("⚠️ No geocode found, using default fallback.");
    return { lat: 12.823, lng: 80.045 }; // fallback (SRM)
  } catch (err) {
    console.error("❌ Geocoding Error:", err.message);
    return { lat: 12.823, lng: 80.045 }; // fallback
  }
};
