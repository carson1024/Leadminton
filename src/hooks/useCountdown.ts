import { useState, useEffect } from 'react';

export function useCountdown(targetDate: number) {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = targetDate - Date.now();
      setTimeLeft(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}