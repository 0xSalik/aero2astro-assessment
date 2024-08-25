"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LatLngExpression } from "leaflet";
import { ChevronUp, ChevronDown } from "lucide-react";

function ChangeMapView({ coords }: { coords: LatLngExpression }) {
  const map = useMap();
  map.setView(coords, 13);
  return null;
}

// Fix for the default icon issue
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

export default function Home() {
  const [userLocation, setUserLocation] = useState<LatLngExpression>([
    51.5074, -0.1278,
  ]);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([
    51.5074, -0.1278,
  ]);

  const [range, setRange] = useState(300);
  const [searchCoords, setSearchCoords] = useState({
    lat: "51.5074",
    lng: "-0.1278",
  });
  const [matchedPilots, setMatchedPilots] = useState<any[]>([]);
  const [pilots, setPilots] = useState<any[]>([]);
  const [sortColumn, setSortColumn] = useState("experience");
  const [sortDirection, setSortDirection] = useState("desc");
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    fetchPilots();
  }, []);

  const fetchPilots = async () => {
    const response = await fetch("/api/pilots");
    const data = await response.json();
    setPilots(data);
  };

  const handleRangeChange = (value: number[]) => {
    setRange(value[0]);
  };

  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  const handleSearch = useCallback(() => {
    const lat = parseFloat(searchCoords.lat);
    const lng = parseFloat(searchCoords.lng);

    if (isNaN(lat) || isNaN(lng)) {
      alert("Please enter valid coordinates");
      return;
    }

    setMapCenter([lat, lng]);

    const matched = pilots
      .map((pilot) => ({
        ...pilot,
        distance: calculateDistance(lat, lng, pilot.lat, pilot.lng),
      }))
      .filter((pilot) => pilot.distance <= range)
      .sort((a, b) => b.experience - a.experience)
      .slice(0, 10);

    setMatchedPilots(matched);
  }, [searchCoords, pilots, range, calculateDistance]);

  useEffect(() => {
    if (pilots.length > 0) {
      handleSearch();
    }
  }, [handleSearch, pilots]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }

    const sortedPilots = [...matchedPilots].sort((a, b) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setMatchedPilots(sortedPilots);
  };

  const useCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setSearchCoords({
          lat: latitude.toString(),
          lng: longitude.toString(),
        });
        setMapCenter([latitude, longitude]);
      });
    } else {
      alert("Geolocation is not available in your browser.");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ChevronUp className="inline" />
      ) : (
        <ChevronDown className="inline" />
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Search Pilots</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Latitude"
                value={searchCoords.lat}
                onChange={(e) =>
                  setSearchCoords({ ...searchCoords, lat: e.target.value })
                }
              />
              <Input
                placeholder="Longitude"
                value={searchCoords.lng}
                onChange={(e) =>
                  setSearchCoords({ ...searchCoords, lng: e.target.value })
                }
              />
              <div className="space-y-2">
                <label>Range: {range} km</label>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={[range]}
                  onValueChange={handleRangeChange}
                />
              </div>
              <div className="flex gap-3">
                <Button onClick={handleSearch}>Search</Button>
                <Button onClick={useCurrentLocation} variant="outline">
                  Use My Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Pilot Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ height: "400px" }}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
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
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matched Pilots</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </TableHead>
                <TableHead onClick={() => handleSort("experience")}>
                  Experience {getSortIcon("experience")}
                </TableHead>
                <TableHead onClick={() => handleSort("distance")}>
                  Distance {getSortIcon("distance")}
                </TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matchedPilots.map((pilot: any) => (
                <TableRow key={pilot.id}>
                  <TableCell>{pilot.name}</TableCell>
                  <TableCell>{pilot.experience} years</TableCell>
                  <TableCell>{pilot.distance.toFixed(2)} km</TableCell>
                  <TableCell>
                    {pilot.city}, {pilot.country}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
