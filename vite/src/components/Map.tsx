import React, { useEffect, useState } from "react";
import styled from "styled-components";
import InfoBox from "./InfoBox";
import {
  Map as MapLibreMap,
  NavigationControl,
  Marker,
  Popup,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const MapWrapper = styled.div`
  height: 100%;
  width: 100%;
`;

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  cmetadata: Record<string, any>; // Assuming metadata is dynamic
}

/**
 * Central map component
 */
export const Map: React.FC = () => {
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null); // Store map instance
  const [mapReady, setMapReady] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]); // Store locations from API
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  ); // State to store selected location

  // Fetch locations from your API when component mounts
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:8000/locations"); // Replace with your API endpoint
        const data: Location[] = await response.json(); // Assuming the API returns an array of locations

        setLocations(data);
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations(); // Call API to get locations
  }, []);

  useEffect(() => {
    if (!mapReady || mapInstance) return;

    const map = new MapLibreMap({
      container: "central-map",
      center: [-1.549077, 53.800755], // Default center coordinates
      zoom: 6,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=pZEHwGwcYFgGP9mOMCRb`, // Map style
    });

    const nav = new NavigationControl({
      visualizePitch: true,
    });
    map.addControl(nav, "top-left");

    setMapInstance(map); // Store the map instance
    console.log("map instance set");
  }, [mapReady, mapInstance]);

  useEffect(() => {
    if (!mapInstance || locations.length === 0) return; // Check if mapInstance is not null and locations are available
    console.log("locations changed:", locations);
    locations.forEach((location) => {
      console.log("Adding marker for location:", location[1]);

      const marker = new Marker()
        .setLngLat([location[2], location[1]]) // Marker coordinates
        .setPopup(new Popup().setText(location[6]["context_text"]))
        .addTo(mapInstance); // Add to map
      marker.getElement().addEventListener("click", () => {
        setSelectedLocation(location); // Set the clicked location information in state
      });
    });
  }, [locations, mapInstance]);

  return (
    <Wrapper>
      <MapWrapper ref={() => setMapReady(true)} id="central-map" />{" "}
      {selectedLocation && (
        <InfoBox
          name={selectedLocation[3]}
          description={selectedLocation[6]["context_text"]}
        />
      )}
    </Wrapper>
  );
};
