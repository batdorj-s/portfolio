import { useEffect, useState } from 'react';

export function Splash({ onFinish }: { onFinish: () => void }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const duration = 1300;
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => setDone(true), 350);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(onFinish, 900);
    return () => clearTimeout(id);
  }, [done, onFinish]);

  // Safety fallback: never let the splash trap the page
  useEffect(() => {
    const fallback = window.setTimeout(() => setDone(true), 2600);
    return () => clearTimeout(fallback);
  }, []);

  return (
    <div className={`splash ${done ? 'done' : ''}`} aria-hidden="true">
      <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block mglv text-white/15 text-base">ᠮᠣᠩᠭᠣᠯ</div>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden md:block mglv text-white/15 text-base">ᠪᠠᠲᠤᠳᠣᠷᠵᠢ</div>

      <div className="flex flex-col items-center gap-8">
        <div className="text-7xl md:text-8xl font-bold tracking-tight" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          {count}
          <span className="text-white/30">%</span>
        </div>
        <div className="w-56 md:w-72 h-px bg-white/15 relative overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-white"
            style={{ width: `${count}%`, transition: 'width 0.1s linear' }}
          ></div>
        </div>
        <div className="text-[9px] tracking-[0.5em] uppercase opacity-60 ascii-flicker" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          loading portfolio — batdorj s.
        </div>
      </div>
    </div>
  );
}
