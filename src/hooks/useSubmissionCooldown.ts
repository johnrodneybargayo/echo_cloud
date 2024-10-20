// src/hooks/useSubmissionCooldown.ts
import { useState, useEffect } from 'react';

export const useSubmissionCooldown = (key: string, submitDelay: number = 10 * 60 * 1000) => {
  const [canSubmit, setCanSubmit] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const lastSubmissionTime = localStorage.getItem(key);
    if (lastSubmissionTime) {
      const now = Date.now();
      const timeElapsed = now - parseInt(lastSubmissionTime, 10);

      if (timeElapsed < submitDelay) {
        setCanSubmit(false);
        setTimeLeft(submitDelay - timeElapsed);

        const timer = setInterval(() => {
          const remainingTime = submitDelay - (Date.now() - parseInt(lastSubmissionTime, 10));
          if (remainingTime <= 0) {
            clearInterval(timer);
            setCanSubmit(true);
            setTimeLeft(null);
          } else {
            setTimeLeft(remainingTime);
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }, [key, submitDelay]);

  const recordSubmissionTime = () => {
    localStorage.setItem(key, Date.now().toString());
    setCanSubmit(false);
    setTimeLeft(submitDelay);
  };

  return { canSubmit, timeLeft, recordSubmissionTime };
};
