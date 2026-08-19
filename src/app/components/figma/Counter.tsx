import { useEffect, useRef, useState } from 'react';

interface CounterProps {
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
  dark?: boolean;
}

export function Counter({
  end,
  suffix = '',
  label,
  duration = 1600,
  dark = false,
}: CounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(end);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min((t - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setValue(Math.round(eased * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-4xl md:text-5xl font-serif italic leading-none ${
          dark ? 'text-brand' : 'text-white'
        }`}
        style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
      >
        {value}
        <span className="text-2xl md:text-3xl not-italic">{suffix}</span>
      </div>
      <div
        className={`mt-3 text-[9px] tracking-[0.35em] uppercase ${
          dark ? 'text-brand/50' : 'text-white/50'
        }`}
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        {label}
      </div>
    </div>
  );
}