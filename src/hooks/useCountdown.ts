import { useState, useEffect } from 'react';

export function useCountdown(targetDate: number, endDate: number) {
  const [timeLeft, setTimeLeft] = useState(targetDate - Date.now());

  useEffect(() => {
    if(timeLeft==0)
        return ;
    const interval = setTimeout(() => {
      const remaining = targetDate - Date.now();
      // setTimeLeft(remaining > 0 ? remaining : endDate-Date.now());
      if(remaining > 0)
        setTimeLeft(remaining);
      else if(endDate-Date.now()>0)
        setTimeLeft(Date.now() - endDate);
      else setTimeLeft(0);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return timeLeft;
}