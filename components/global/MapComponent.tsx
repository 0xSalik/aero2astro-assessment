"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet";

function ChangeMapView({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

L.Icon.Default.imagePath = "/";
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "marker-icon-2x.png",
  iconUrl: "marker-icon.png",
  shadowUrl: "marker-shadow.png",
});

const greenIcon = new L.Icon({
  iconUrl: "/marker-icon-2x-green.png",
  iconRetinaUrl: "/marker-icon-2x-green.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapComponentProps {
  mapCenter: LatLngExpression;
  userLocation: LatLngExpression;
  pilots: any[];
}

const MapComponent: React.FC<MapComponentProps> = ({
  mapCenter,
  userLocation,
  pilots,
}) => {
  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {pilots.map((pilot) => (
        <Marker key={pilot.id} position={[pilot.lat, pilot.lng]}>
          <Popup>
            {pilot.name} <br /> Experience: {pilot.experience} years
          </Popup>
        </Marker>
      ))}
      <Marker position={userLocation} icon={greenIcon}>
        <Popup>Your Location</Popup>
      </Marker>
      <ChangeMapView coords={mapCenter} />
    </MapContainer>
  );
};

export default MapComponent;
