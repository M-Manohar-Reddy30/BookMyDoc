import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

const DEFAULT_CENTER = [12.823, 80.045]; // SRM fallback

// Helper component to fit map bounds dynamically
const FitBounds = ({ doctors }) => {
  const map = useMap();

  useEffect(() => {
    if (!doctors || doctors.length === 0) return;

    const bounds = L.latLngBounds(
      doctors.map((doc) => [doc.lat || 12.823, doc.lng || 80.045])
    );

    map.fitBounds(bounds, { padding: [50, 50] });
  }, [doctors, map]);

  return null;
};

const DoctorMap = ({ doctors }) => {
  if (!doctors || doctors.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No doctors to display on map.
      </div>
    );
  }

  // fix marker icons for leaflet
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  return (
    <div className="rounded-xl overflow-hidden border border-gray-300 shadow-md">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={6}
        scrollWheelZoom={true}
        className="h-[80vh] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit map to doctors */}
        <FitBounds doctors={doctors} />

        {/* Doctor markers */}
        {doctors.map((doc) => (
          <Marker
            key={doc._id}
            position={[doc.lat || 12.823, doc.lng || 80.045]}
          >
            <Popup>
              <div className="text-center">
                <p className="font-bold text-lg">{doc.name}</p>
                <p>{doc.speciality}</p>
                <p>₹ {doc.fees}</p>
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
      </MapContainer>
    </div>
  );
};

export default DoctorMap;
