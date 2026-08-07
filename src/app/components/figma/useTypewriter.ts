import { useEffect, useState } from 'react';

export function useTypewriter(text: string, speed = 65, loop = false, startDelay = 0) {
  const [out, setOut] = useState('');

  useEffect(() => {
    let i = 0;
    let direction = 1;
    let timeout = 0;

    const step = () => {
      if (direction === 1) {
        i += 1;
        setOut(text.slice(0, i));
        if (i >= text.length) {
          if (!loop) return;
          direction = -1;
          timeout = window.setTimeout(step, 2200);
        } else {
          timeout = window.setTimeout(step, speed);
        }
      } else {
        i -= 1;
        setOut(text.slice(0, i));
        if (i <= 0) {
          direction = 1;
          timeout = window.setTimeout(step, 500);
        } else {
          timeout = window.setTimeout(step, 26);
        }
      }
    };

    const start = window.setTimeout(step, startDelay);
    return () => {
      clearTimeout(timeout);
      clearTimeout(start);
    };
  }, [text, speed, loop, startDelay]);

  return out;
}
