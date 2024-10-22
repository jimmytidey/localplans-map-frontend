import React, { useEffect, useState, useRef } from "react";
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

interface TextFragment {
  title: string;
  sections: string;
  text: string;
}

interface Location {
  latitude: number;
  longitude: number;
  location_names: string[];
  text_fragment_count: number;
  text_fragments: TextFragment[];
}
interface Locations {
  locations: Location[];
}

export const Map: React.FC = () => {
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);
  const [locations, setLocations] = useState<Locations | null>(null); // Ensure it's initialized as an empty array
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );

  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstance) return;

    const map = new MapLibreMap({
      container: mapContainerRef.current,
      center: [-1.549077, 53.800755],
      zoom: 6,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=pZEHwGwcYFgGP9mOMCRb`,
    });

    const nav = new NavigationControl({
      visualizePitch: true,
    });
    map.addControl(nav, "top-left");

    setMapInstance(map);
    console.log("Map instance initialized");

    return () => {
      map.remove();
    };
  }, []); // Empty dependency array ensures it only runs once

  useEffect(() => {
    const fetchLocations = async () => {
      console.log("Fetching locations");
      try {
        const response = await fetch("http://localhost:8000/locations");
        const data: Locations = await response.json();
        console.log("Locations fetched:", data);
        setLocations(data); // Ensure locations is set properly
      } catch (error) {
        console.error("Failed to fetch locations:", error);
      }
    };

    fetchLocations(); // Fetch locations on component mount
  }, []);

  useEffect(() => {
    if (!mapInstance || !locations) {
      return;
    }

    console.log("Adding markers for locations", locations);

    // Loop through each location to add markers
    locations.locations.forEach((location, index) => {
      // Log the coordinates to verify they exist
      console.log(`Location at index ${index}:`, location);

      const { latitude, longitude } = location;

      if (typeof latitude !== "number" || typeof longitude !== "number") {
        console.error(`Invalid coordinates at index ${index}`, location);
        return;
      }

      try {
        console.log(`Rendering marker for location at index ${index}`);
        const marker = new Marker()
          .setLngLat([longitude, latitude]) // Corrected the order
          .setPopup(new Popup().setText(location.location_names.join(", ")))
          .addTo(mapInstance);

        marker.getElement().addEventListener("click", () => {
          console.log("Marker clicked", location);
          setSelectedLocation(location);
        });
      } catch (error) {
        console.error(
          `Failed to add marker for location at index ${index}`,
          error
        );
      }
    });
  }, [locations, mapInstance]);

  return (
    <Wrapper>
      <MapWrapper ref={mapContainerRef} id="central-map" />
      {selectedLocation && <InfoBox location={selectedLocation} />}
    </Wrapper>
  );
};
