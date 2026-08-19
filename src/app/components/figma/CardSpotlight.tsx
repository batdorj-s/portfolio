import { useRef, type ReactNode, type MouseEvent } from 'react';

/**
 * Card with cursor-tracking spotlight AND subtle 3D tilt.
 * Fine-pointer devices only; on touch the card stays flat.
 */
export function CardSpotlight({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    el.style.setProperty('--mx', `${px}px`);
    el.style.setProperty('--my', `${py}px`);

    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rx = ((py / rect.height) - 0.5) * -8;
    const ry = ((px / rect.width) - 0.5) * 8;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    el.style.transition = 'transform 0.15s ease-out';
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave} className={`relative ${className}`} style={{ willChange: 'transform' }}>
      {children}
      <div
        className="pointer-events-none absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.10), transparent 60%)',
        }}
      />
    </div>
  );
}
