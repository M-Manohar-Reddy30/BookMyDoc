import React, { useEffect, useState, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

const DEFAULT_CENTER = [20.5937, 78.9629]; // Center of India

// Default marker setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Auto-fit map to visible markers
const FitBounds = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || markers.length === 0) return;
    const latLngs = markers.map((m) => [m.lat, m.lng]);
    const bounds = L.latLngBounds(latLngs);
    const isMobile = window.innerWidth < 768;
    map.fitBounds(bounds, {
      padding: isMobile ? [20, 20] : [50, 50],
      maxZoom: isMobile ? 10 : 13,
    });
  }, [map, markers]);
  return null;
};

const NearbyDoctors = () => {
  const [userLocation, setUserLocation] = useState(DEFAULT_CENTER);
  const [doctors, setDoctors] = useState([]);
  const [mode, setMode] = useState("all");
  const [radiusKm, setRadiusKm] = useState(50);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [speciality, setSpeciality] = useState("All");
  const [availability, setAvailability] = useState("All");
  const mapRef = useRef(null);

  const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // 🧭 Get user GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserLocation(coords);
        },
        () => setUserLocation(DEFAULT_CENTER)
      );
    }
  }, []);

  // Fetch doctors
  useEffect(() => {
    fetchDoctors();
  }, [mode, userLocation, radiusKm]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const [lat, lng] = userLocation;
      const url =
        mode === "nearby"
          ? `${BACKEND}/api/doctor/nearby?latitude=${lat}&longitude=${lng}&radius=${radiusKm}`
          : `${BACKEND}/api/doctor/list`;

      const { data } = await axios.get(url);
      if (data?.success) {
        setDoctors(
          data.doctors
            .filter(
              (d) =>
                Number.isFinite(Number(d.lat)) && Number.isFinite(Number(d.lng))
            )
            .map((d) => ({
              ...d,
              lat: Number(d.lat),
              lng: Number(d.lng),
            }))
        );
      }
    } catch (err) {
      console.error("Fetch doctors error:", err);
    } finally {
      setLoading(false);
    }
  };

  const visibleDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const matchSpec = speciality === "All" || doc.speciality === speciality;
      const matchAvail =
        availability === "All" ||
        (availability === "Available" ? doc.available : !doc.available);
      const matchSearch =
        search.trim() === "" ||
        (doc.name && doc.name.toLowerCase().includes(search.toLowerCase())) ||
        (doc.degree && doc.degree.toLowerCase().includes(search.toLowerCase()));
      return matchSpec && matchAvail && matchSearch;
    });
  }, [doctors, speciality, availability, search]);

  const fitAll = () => {
    if (mapRef.current && visibleDoctors.length > 0) {
      const latLngs = visibleDoctors.map((m) => [m.lat, m.lng]);
      const bounds = L.latLngBounds(latLngs);
      const isMobile = window.innerWidth < 768;
      mapRef.current.fitBounds(bounds, {
        padding: isMobile ? [20, 20] : [50, 50],
        maxZoom: isMobile ? 10 : 13,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-500 animate-pulse text-lg">
          Loading doctors on map...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-2xl font-bold">🩺 Find Doctors Nearby</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border px-3 py-3 rounded-md min-h-[44px] text-base"
          >
            <option value="all">All Doctors</option>
            <option value="nearby">Nearby (GPS)</option>
          </select>

          {mode === "nearby" && (
            <input
              type="number"
              min="5"
              max="500"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="border px-3 py-3 rounded-md w-24 min-h-[44px] text-base"
              placeholder="Radius km"
            />
          )}

          <button
            onClick={fitAll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-md text-base min-h-[44px]"
          >
            🌍 Fit All
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search doctor or degree..."
          className="border px-3 py-3 rounded-md w-60 min-h-[44px] text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={speciality}
          onChange={(e) => setSpeciality(e.target.value)}
          className="border px-3 py-3 rounded-md min-h-[44px] text-base"
        >
          <option value="All">All Specialities</option>
          <option value="General physician">General Physician</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Neurologist">Neurologist</option>
          <option value="Pediatricians">Pediatricians</option>
          <option value="Gastroenterologist">Gastroenterologist</option>
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="border px-3 py-3 rounded-md min-h-[44px] text-base"
        >
          <option value="All">All</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {/* Map */}
      <MapContainer
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
        center={DEFAULT_CENTER}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={false}
        doubleClickZoom={false}
        touchZoom={true}
        preferCanvas={true}
        className="h-[70vh] sm:h-[80vh] w-full rounded-lg shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Marker */}
        {mode === "nearby" && (
          <Marker position={userLocation}>
            <Popup>
              📍 <b>Your Location</b>
            </Popup>
          </Marker>
        )}

        {/* Clustered Doctor Markers */}
        <MarkerClusterGroup chunkedLoading>
          {visibleDoctors.map((doc) => (
            <Marker key={doc._id} position={[doc.lat, doc.lng]}>
              <Popup>
                <div className="text-center">
                  <img
                    src={doc.image?.replace(/\.(png|jpg|jpeg)$/i, ".webp")}
                    alt={doc.name}
                    loading="lazy"
                    className="w-24 h-24 mx-auto rounded-full object-cover mb-2 shadow-sm"
                    onLoad={(e) => e.target.classList.add("loaded")}
                  />
                  <p className="font-bold text-lg">{doc.name}</p>
                  <p className="text-sm text-gray-600">{doc.speciality}</p>
                  <p className="text-sm">₹ {doc.fees}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-semibold underline mt-2 block"
                  >
                    Get Directions →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        <FitBounds markers={visibleDoctors} />
      </MapContainer>
    </div>
  );
};

export default NearbyDoctors;
