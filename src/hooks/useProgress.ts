import { useState, useEffect } from 'react';

export function useProgress(startTime: number | undefined, period: number | undefined, callback: () => void, interval = 1000) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!period || !startTime) {
      setProgress(0);
      setTimeLeft(0);
      return;
    }

    const updateProgress = () => {
      const now = Date.now();
      const remaining = startTime + period - now;
      const newProgress = Math.max(0, Math.min(100, ((period - remaining) / period) * 100));
      const newTimeLeft = Math.max(0, Math.ceil(remaining / 1000));
      
      setProgress(newProgress);
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft == 0) {
        callback && callback();
      }
    };

    updateProgress();
    const timer = setInterval(updateProgress, interval);

    return () => clearInterval(timer);
  }, [startTime, period, interval]);

  return { progress, timeLeft };
}