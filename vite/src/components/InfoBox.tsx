import React from "react";
import styled from "styled-components";

// Styled component for the bottom-third div
const InfoBoxWrapper = styled.div`
  position: fixed; /* Fixes the div to the viewport */
  bottom: 4em; /* Positions it 4em from the bottom */
  left: 4em; /* 4em margin on the left */
  right: 4em; /* 4em margin on the right */
  height: calc(50vh - 4em); /* Bottom third of the screen minus the margin */
  background-color: #f0f0f0; /* Background color (you can customize this) */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Adds a subtle shadow */
  padding: 1em; /* Padding inside the div */
  border-radius: 10px; /* Rounded corners (optional) */
  overflow-y: auto; /* Allows scrolling if content overflows */
`;

interface InfoBoxProps {
  name: string;
  description: string;
}

// The functional component

const InfoBox: React.FC<InfoBoxProps> = ({ name, description }) => {
  return (
    <InfoBoxWrapper>
      <h2>{name}</h2>
      <p>{description}</p>
    </InfoBoxWrapper>
  );
};

export default InfoBox;
