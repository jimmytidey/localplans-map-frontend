import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled component for the InfoBox
const InfoBoxWrapper = styled.div`
  position: fixed;
  bottom: 4em;
  left: 4em;
  right: 4em;
  height: calc(45vh - 4em);
  background-color: #f0f0f0;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1em;
  border-radius: 10px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr; /* Two equal columns */
  gap: 2em; /* Gap between the columns */
`;

// Styled component for the Summary and Text Fragments
const Column = styled.div`
  padding: 1em;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

// Interface for a single text fragment object
interface TextFragment {
  title: string;
  sections: string;
  text: string; // New field to represent the text content
}

// Interface for a single location entry
interface Location {
  latitude: number; // Represents the latitude of the location
  longitude: number; // Represents the longitude of the location
  location_names: string[]; // Array of location names associated with the location
  text_fragment_count: number; // Number of distinct text fragments
  text_fragments: TextFragment[]; // Array of text fragments with title, sections, and text
}

interface Summary {
  summary: string;
  prompt: string; // Optional properties can be marked with "?"
}

// Define props for InfoBox
interface InfoBoxProps {
  location: Location; // Pass location as a prop
}

const InfoBox: React.FC<InfoBoxProps> = ({ location }) => {
  const [summary, setSummary] = useState<Summary>({
    summary: "Loading...",
    prompt: "Loading...",
  });

  // Function to call the summarise_text API
  const fetchSummary = async (location: Location) => {
    setSummary({ summary: "Loading...", prompt: "Loading..." });

    const text_array = location.text_fragments.map((fragment) => {
      return `\n\nTitle: ${fragment.title}, \nSection: ${fragment.sections}, \nText: ${fragment.text}`;
    });
    try {
      console.log("Request made");
      const response = await fetch("http://localhost:8000/summarise_location", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location_names: location.location_names,
          text_fragments: text_array,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setSummary(data); // Update the summary state with the response
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary({ summary: "Error", prompt: "Error" });
    }
  };

  // Use useEffect to call fetchSummary only when locationNames or textFragments change
  useEffect(() => {
    fetchSummary(location);
  }, [location]); // Dependency array ensures fetch is only called when these change

  return (
    <InfoBoxWrapper>
      {/* Column for Summary */}
      <Column>
        <h3>Summary</h3>
        <p>{summary["summary"]}</p> {/* Display the summary here */}
      </Column>

      {/* Column for Text Fragments */}
      <Column>
        <h4>Prompt</h4>
        <p>{summary["prompt"]}</p>
        <h4>Text fragments</h4>
        {location.text_fragments.map((fragment, index) => (
          <div>
            <strong>
              <p key={index}>{fragment.title}</p>
            </strong>
            <em>
              <p key={index}>{fragment.sections}</p>
            </em>
            <p key={index}>{fragment.text}</p>
          </div>
        ))}
      </Column>
    </InfoBoxWrapper>
  );
};

export default InfoBox;
