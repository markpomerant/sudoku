import { useState, useEffect, useCallback } from "react";

export function useTimer(active = true) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(active);

  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  return {
    elapsedSeconds,
    isActive,
    start,
    stop,
    reset,
    setElapsedSeconds,
  };
}
