import React from "react";

export default function TimerDisplay({ seconds }) {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  return (
    <span style={{ fontSize: "14px", color: "#777" }}>🕒 {formatTime(seconds)}</span>
  );
}