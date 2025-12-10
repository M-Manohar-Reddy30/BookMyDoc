import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

// Fix marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Inner component handles clicks and drags
function LocationMarker({ coords, setCoords, onCoordsChange }) {
  const [position, setPosition] = useState(coords);

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      setCoords(newPos);
      onCoordsChange(newPos);
    },
  });

  return (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const lat = e.target.getLatLng().lat;
          const lng = e.target.getLatLng().lng;
          setPosition([lat, lng]);
          setCoords([lat, lng]);
          onCoordsChange([lat, lng]);
        },
      }}
    >
      <Popup>📍 Drag or click map to set doctor location</Popup>
    </Marker>
  );
}

const AdminMapPreview = ({ address, onCoordsChange }) => {
  const [coords, setCoords] = useState([12.823, 80.045]); // Default SRM
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address.line1 && !address.line2) return;

    const fetchCoords = async () => {
      try {
        setLoading(true);
        const query = `${address.line1 || ""}, ${address.line2 || ""}`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);
        if (data.length > 0) {
          const newCoords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setCoords(newCoords);
          onCoordsChange(newCoords);
        }
      } catch (err) {
        console.error("Error fetching coordinates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, [address]);

  return (
    <div className="mt-6 border rounded-lg p-3 bg-white shadow">
      <h3 className="text-lg font-semibold text-center mb-3">📍 Doctor Location (Interactive)</h3>
      {loading && <p className="text-center text-gray-500">Loading map...</p>}

      <MapContainer
        center={coords}
        zoom={14}
        scrollWheelZoom
        style={{ height: "350px", width: "100%", borderRadius: "10px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <LocationMarker coords={coords} setCoords={setCoords} onCoordsChange={onCoordsChange} />
      </MapContainer>

      <div className="text-center mt-3 text-sm text-gray-600">
        <p>
          <b>Latitude:</b> {coords[0].toFixed(5)} | <b>Longitude:</b> {coords[1].toFixed(5)}
        </p>
        <p className="text-blue-600">Drag or click map to update location 👇</p>
      </div>
    </div>
  );
};

export default AdminMapPreview;
