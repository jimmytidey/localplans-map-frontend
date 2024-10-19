import React, { useState, useEffect } from "react";

// TypeScript interfaces for the API response
interface Cmetadata {
  geocoding_complete: boolean;
  [key: string]: any; // Allows dynamic properties in cmetadata
}

interface Location {
  id: number;
  name: string;
  embedding_id: number;
  cmetadata: Cmetadata;
}

const FetchLocations: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the FastAPI endpoint
  const fetchLocationsData = async () => {
    try {
      const response = await fetch("http://localhost:8000/locations"); // Replace with your FastAPI URL
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Location[] = await response.json(); // Cast the response to the Location[] type
    } catch (error) {
      setError((error as Error).message); // Cast error to Error type to get the message
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Locations</h1>
      <ul>
        {locations.map((location) => (
          <li key={location.id}>
            {location.name} - Embedding Metadata:{" "}
            {JSON.stringify(location.cmetadata)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FetchLocations;
