import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Map as MapLibreMap, NavigationControl, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

/**
 * Central map component
 */
export const Map: React.FC = () => {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapReady) return;

    const map = new MapLibreMap({
      container: "central-map",
      center: [-1.549077, 53.800755],
      zoom: 6,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=pZEHwGwcYFgGP9mOMCRb`, // Style
    });

    const nav = new NavigationControl({
      visualizePitch: true,
    });
    map.addControl(nav, "top-left");

    // @ts-expect-error for debugging
    window.map = map;

    map.on("click", (e) => {
      console.log(e);
      console.log([e.lngLat.lng, e.lngLat.lat]);
      const marker = new Marker()
        .setLngLat([-1.549077, 53.800755]) // Marker coordinates
        .addTo(map); // Add to map
    });

    map.on("load", (e) => {
      const marker = new Marker()
        .setLngLat([-1.549077, 53.800755]) // Marker coordinates
        .addTo(map); // Add to map
    });
  }, [mapReady]);

  return <Wrapper ref={() => setMapReady(true)} id="central-map" />;
};
