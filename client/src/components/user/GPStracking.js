import React, { useState } from "react";
import { Button, message } from "antd";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import UpdateProfile from "../../pages/UpdateProfile";

// Custom red marker icon
const customIcon = new L.Icon({
  iconUrl: "https://img.icons8.com/ios/452/map-pin.png", // Custom marker image
  iconSize: [30, 30], // Adjust icon size
  iconAnchor: [15, 30], // Anchor position for the marker
});

export default function LocationPicker() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Fetch address using OpenStreetMap Nominatim API
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      setAddress(res.data.display_name || "Address not found");
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle location click on the map
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });
        fetchAddress(lat, lng);
      },
    });
    return null;
  };

  const handleAddLocation = () => {
    setShowMap(true); // Show the map on button click
  };

  const handleConfirmLocation = () => {
    if (!location) {
      message.error("Please select a location before confirming!");
      return; // Prevent further action if no location is selected
    }
    console.log("Confirmed Location:", {
      lat: location.lat,
      lng: location.lng,
      address,
    });
    // Save the GPS coordinates and address in your preferred storage (e.g., state, database, etc.)
    setShowMap(false); // Close the map after confirmation
  };
  <UpdateProfile showMap={showMap} />;

  return (
    <div style={{ margin: "20px", padding: "10px" }}>
      <Button
        type="primary"
        onClick={handleAddLocation}
        style={{ marginBottom: "10px", animation: "fadeIn 0.5s" }} // Added animation on button click
      >
        Add Location
      </Button>

      {showMap && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          {/* Display map */}
          <MapContainer
            center={[7.3, 81.7]} // Centering on Ampara, Sri Lanka
            zoom={12}
            style={{
              height: "500px",
              width: "80%",
              margin: "auto",
              borderRadius: "5px",
            }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler />
            {location && (
              <Marker position={[location.lat, location.lng]} icon={customIcon}>
                <Popup>{address}</Popup>
              </Marker>
            )}
          </MapContainer>
          {address && (
            <p>
              <b>Selected Address:</b> {address}
            </p>
          )}
          <Button
            type="primary"
            onClick={handleConfirmLocation}
            style={{ marginTop: "30px"}}
          >
            Confirm Location
          </Button>
        </div>
      )}
    </div>
  );
}
