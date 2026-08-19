interface SectionLabelProps {
  index: string;
  label: string;
  dark?: boolean;
  className?: string;
}

export function SectionLabel({
  index,
  label,
  dark = false,
  className = '',
}: SectionLabelProps) {
  return (
    <div
      className={`inline-flex items-center gap-3 text-[10px] tracking-[0.5em] font-bold uppercase ${
        dark ? 'text-brand' : 'text-white'
      } ${className}`}
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      <span className="opacity-40">{index}</span>
      <span className={`h-px w-10 ${dark ? 'bg-brand/30' : 'bg-white/30'}`}></span>
      <span className="opacity-70">{label}</span>
    </div>
  );
}