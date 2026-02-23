import { useState, useEffect } from 'react';

export const useAuctionTimer = (initialEndTime) => {
  const [endTime, setEndTime] = useState(new Date(initialEndTime));
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0, totalSeconds: 0 });

  // Update endTime if the WebSocket sends a new timestamp (Auto-Extension)
  useEffect(() => {
    setEndTime(new Date(initialEndTime));
  }, [initialEndTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((endTime - now) / 1000));

      setTimeLeft({
        minutes: Math.floor(diff / 60),
        seconds: diff % 60,
        totalSeconds: diff
      });

      if (diff <= 0) clearInterval(timer);
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return timeLeft;
};
