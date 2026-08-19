import React, { useEffect, useRef } from 'react';

/**
 * Custom trailing cursor — a solid dot tracks the pointer instantly while a
 * soft ring follows with lerp. mix-blend-difference keeps it visible on both
 * blue and white sections. Fine-pointer devices only.
 *
 * Elements with [data-cursor="view"|"play"] swap the ring for a labeled pill.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let mode = 'default';

    const applyMode = (next: string) => {
      if (next === mode) return;
      mode = next;
      const label = labelRef.current;
      const ring = ringRef.current;
      if (!label || !ring) return;
      if (next === 'default') {
        label.style.opacity = '0';
        label.style.transform = 'translate(-50%, -50%) scale(0.6)';
        ring.style.opacity = '1';
        ring.style.width = '2rem';
        ring.style.height = '2rem';
        ring.style.borderRadius = '9999px';
        ring.style.borderWidth = '1px';
        ring.style.background = 'transparent';
      } else {
        label.textContent = next === 'play' ? 'PLAY' : 'VIEW';
        label.style.opacity = '1';
        label.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(1)`;
        ring.style.opacity = '0';
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest?.('[data-cursor]') as HTMLElement | null;
      applyMode(el?.dataset.cursor === 'play' ? 'play' : el?.dataset.cursor === 'view' ? 'view' : 'default');
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px)`;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform =
          mode === 'default'
            ? 'translate(-50%, -50%) scale(0.6)'
            : `translate(${rx}px, ${ry}px) translate(-50%, -50%) scale(1)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:flex items-center justify-center h-8 w-8 -ml-4 -mt-4 rounded-full border border-white/60 mix-blend-difference transition-[width,height,opacity] duration-300"
      />
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden md:block px-3 py-1.5 rounded-full bg-white text-[#0000FF] text-[8px] tracking-[0.3em] font-bold uppercase opacity-0 transition-opacity duration-300"
        style={{ transform: 'translate(-50%, -50%) scale(0.6)' }}
      >
        VIEW
      </span>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[201] hidden md:block h-1.5 w-1.5 -ml-[3px] -mt-[3px] rounded-full bg-white mix-blend-difference"
      />
    </>
  );
}

export default CustomCursor;