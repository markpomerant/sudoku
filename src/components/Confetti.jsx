// Confetti.jsx
// -------------
// Simple confetti animation component for Sudoku win state.
// Uses only CSS and React for lightweight effect.

import React, { useEffect, useRef } from "react";
import styled from '@emotion/styled';

const COLORS = [
  "#FFD700", "#FF69B4", "#1B998B", "#39FF14", "#1976D2", "#FF7043", "#B58900", "#E21B80"
];

function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}

export default function Confetti({ count = 80, duration = 5000 }) {
  const containerRef = useRef();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.style.opacity = 0;
      }
    }, duration);
    return () => clearTimeout(timeout);
  }, [duration]);

  return (
    <ConfettiContainer ref={containerRef}>
      {Array.from({ length: count }).map((_, i) => {
        const left = randomBetween(0, 100);
        const delay = randomBetween(0, 2.0);
        const size = randomBetween(6, 14);
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const rotate = randomBetween(0, 360);
        return (
          <ConfettiPiece
            key={i}
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration / 1000}s`,
              width: size,
              height: size * 0.4,
              background: color,
              transform: `rotate(${rotate}deg)`
            }}
          />
        );
      })}
    </ConfettiContainer>
  );
}

const ConfettiContainer = styled.div`
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  transition: opacity 0.7s;
`;

const ConfettiPiece = styled.div`
  position: absolute;
  top: -20px;
  border-radius: 2px;
  opacity: 0.85;
  animation-name: confetti-fall;
  animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
  animation-fill-mode: forwards;

  @keyframes confetti-fall {
    to {
      top: 100vh;
      opacity: 0.7;
      transform: translateY(0.5em) rotate(360deg);
    }
  }
`;
