import React from "react";
import styled from "@emotion/styled";

/**
 * Accessible, styled button wrapper for the timer icon (no event handlers, just for display)
 */
export const TimerIconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-left: 8px;
  display: flex;
  align-items: center;
  cursor: default;
  color: inherit;
  &:hover, &:focus {
    color: var(--accent);
    outline: none;
  }
`;

/**
 * SVG Timer icon for use in the header and elsewhere.
 * @param {{ size?: number }} props
 */
export function TimerIcon({ size = 20 }) {
  return (
    <svg height={size} width={size} viewBox="0 0 93.5 93.5" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g>
        <circle cx="46.95" cy="51.4" r="1.25" fill="currentColor"></circle>
        <circle cx="46.95" cy="56.34" r="1.25" fill="currentColor"></circle>
        <path d="m55.72 43.81 5.4-4.93 2.59-2.35c4.68-4.22 7-9.94 7.09-17.51v-6.36h3.92a1.25 1.25 0 0 0 1.28-1.25v-5.41a1.25 1.25 0 0 0 -1.25-1.25h-55.58a1.25 1.25 0 0 0 -1.25 1.25v5.41a1.25 1.25 0 0 0 1.25 1.25h3.92v6.34c.09 7.55 2.42 13.27 7.1 17.48l3 2.74 5 4.56a4.57 4.57 0 0 1 1.81 3.31 4.76 4.76 0 0 1 -1.93 3.39l-7.9 7.22c-4.68 4.21-7 9.93-7.1 17.5v5.52h-3.9a1.25 1.25 0 0 0 -1.25 1.28v5.41a1.25 1.25 0 0 0 1.25 1.25h55.55a1.25 1.25 0 0 0 1.28-1.28v-5.38a1.25 1.25 0 0 0 -1.25-1.25h-3.95v-5.57c-.09-7.55-2.41-13.27-7.09-17.48l-7.91-7.23a4.71 4.71 0 0 1 -1.91-3.36 4.61 4.61 0 0 1 1.83-3.3zm-4.33 3.31a7.07 7.07 0 0 0 2.73 5.21l7.88 7.22c4.2 3.78 6.19 8.76 6.27 15.65v5.52h-42.68v-5.51c.09-6.9 2.08-11.88 6.28-15.66l7.9-7.21a7.13 7.13 0 0 0 2.75-5.25 6.88 6.88 0 0 0 -2.66-5.09l-5-4.56-3-2.74c-4.19-3.78-6.18-8.76-6.27-15.65v-6.39h42.71v6.34c-.08 6.9-2.07 11.88-6.27 15.66-.87.78-1.73 1.57-2.6 2.37l-5.43 4.97a7 7 0 0 0 -2.61 5.12z" fill="currentColor"></path>
        <path d="m63.41 29a1.24 1.24 0 0 0 -.18-1.48 1.22 1.22 0 0 0 -1.47-.25c-4.93 2.51-6.78 3.45-14.43 1a20 20 0 0 0 -14.88 1 1.25 1.25 0 0 0 -.45 1.9c.48.57 11.36 11 11.46 11a5.78 5.78 0 0 1 1.4 3.31 2 2 0 0 0 2.14 1.74 1.83 1.83 0 0 0 2-1.66 6.42 6.42 0 0 1 2.2-4.11c.17-.15.87-.82 1.82-1.73 2.34-2.24 6.24-6 7.31-6.94a15.26 15.26 0 0 0 3.08-3.78z" fill="currentColor"></path>
        <path d="m29.73 76.72a1.25 1.25 0 0 0 1.27 1.28h31.91a1.25 1.25 0 0 0 1.25-1.25 17.22 17.22 0 0 0 -34.43 0z" fill="currentColor"></path>
      </g>
    </svg>
  );
}
