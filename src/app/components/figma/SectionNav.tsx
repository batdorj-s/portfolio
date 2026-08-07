const SECTIONS = [
  { id: 'intro', label: 'INTRO' },
  { id: 'about', label: 'ABOUT' },
  { id: 'portfolio', label: 'WORK' },
  { id: 'instagram', label: 'INSTA' },
  { id: 'contact', label: 'CV' },
];

export function SectionNav({
  active,
  onNavigate,
}: {
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-5 items-end"
      aria-label="Sections"
    >
      {SECTIONS.map((s) => (
        <button key={s.id} type="button" onClick={() => onNavigate(s.id)} className="group flex items-center gap-3">
          <span
            className={`text-[9px] tracking-[0.4em] font-light transition-all duration-300 ${
              active === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
            }`}
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {s.label}
          </span>
          <span
            className={`block h-1.5 w-1.5 rounded-full transition-all duration-300 shadow-[0_0_0_1px_rgba(0,0,0,0.3)] ${
              active === s.id ? 'bg-white scale-125' : 'bg-white/40 group-hover:bg-white/80'
            }`}
          ></span>
        </button>
      ))}
    </nav>
  );
}
