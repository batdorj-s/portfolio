import { useEffect, useMemo, useRef, useState } from 'react';

/* ============================================================
   ResumeTerminal — blessed-contrib dashboard re-creation
   inspired by examples/dashboard-random-colors.js,
   examples/map.js and examples/marked-terminal.js
   ============================================================ */

const PALETTE = [
  '#34d399', // emerald
  '#38bdf8', // sky
  '#fbbf24', // amber
  '#f472b6', // pink
  '#a3e635', // lime
  '#22d3ee', // cyan
  '#fb7185', // rose
];

const MARKERS = [
  { lon: -79.0, lat: 37.5, color: '#FF5F57', ch: 'X', name: 'nyc' },
  { lon: -122.68, lat: 45.5, color: '#FEBC2E', ch: 'Y', name: 'pdx' },
  { lon: -6.25, lat: 53.35, color: '#28C840', ch: '3', name: 'dub' },
  { lon: 103.8, lat: 1.3, color: '#22d3ee', ch: '4', name: 'sgp' },
  { lon: 106.9, lat: 47.9, color: '#FFFFFF', ch: '*', name: 'uln' },
];

const PROCESSES = [
  { p: 'illustrator', cpu: '14%' },
  { p: 'photoshop', cpu: '11%' },
  { p: 'daVinci Resolve', cpu: ' 9%' },
  { p: 'figma', cpu: ' 7%' },
  { p: 'vite / react', cpu: ' 5%' },
];

const sparkChars = [' ', '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

function toSparkline(data: number[]) {
  const shift = Math.min(...data);
  const range = Math.max(...data) - shift || 1;
  return data
    .map((v) => sparkChars[Math.min(8, Math.max(0, Math.round(((v - shift) / range) * 8)))])
    .join('');
}

/* ---------- stylized world map (examples/map.js) ---------- */
// per latitude band (top->bottom), land extends as [startLon, endLon] segments
const LAND: number[][][] = [
  [[-105, -83], [-50, -20], [60, 180]],
  [[-160, -80], [35, 60], [100, 180]],
  [[-160, -60], [-5, 40], [60, 180]],
  [[-165, -55], [5, 30], [50, 180]],
  [[-128, -55], [5, 40], [55, 160]],
  [[-125, -65], [5, 55], [60, 180]],
  [[-123, -75], [10, 80], [95, 180]],
  [[-122, -80], [5, 90], [135, 180]],
  [[-115, -82], [8, 65], [100, 180]],
  [[-110, -85], [30, 120], [140, 150]],
  [[-105, -90], [35, 70], [65, 180]],
  [[-100, -80], [8, 45], [113, 150]],
  [[-82, -75], [8, 45], [45, 195]],
  [[-75, -40], [12, 40], [113, 160]],
  [[-70, -35], [20, 40], [55, 150]],
  [[-55, -38], [8, 35], [116, 153]],
  [[-60, -39], [25, 35], [130, 153]],
  [[-70, -45], [25, 30], [132, 150]],
  [[-73, -55], [115, 155]],
  [[-70, -56]],
  [[-75, -64], [23, 35]],
  [[-73, -68]],
];

const LON_MIN = -180;
const LON_MAX = 180;
const MAP_ROWS = 25;
const MAP_COLS = 64;
const LAT_TOP = 78;
const LAT_SPAN = 140; // 78..-62, must match buildWorldMap below

function rowOfLat(lat: number) {
  return Math.round(((LAT_TOP - lat) / LAT_SPAN) * MAP_ROWS);
}

function colOfLon(lon: number) {
  return Math.round(((lon - LON_MIN) / (LON_MAX - LON_MIN)) * MAP_COLS) - 1;
}

function posOf(lon: number, lat: number) {
  return {
    x: Math.max(0, Math.min(MAP_COLS - 1, colOfLon(lon))),
    y: Math.max(0, Math.min(MAP_ROWS - 1, rowOfLat(lat))),
  };
}

function buildWorldMap(rows: number): string[][] {
  const grid: string[][] = [];
  for (let r = 0; r < rows; r++) {
    const lat = LAT_TOP - ((LAT_TOP - -62) * r) / rows; // latitude of row center
    const row: string[] = [];
    for (let c = 0; c < MAP_COLS; c++) {
      const lon = LON_MIN + ((LON_MAX - LON_MIN) * (c + 0.5)) / MAP_COLS;
      let land = false;
      const bands = LAND[Math.min(r, LAND.length - 1)];
      if (bands) {
        for (const [a, b] of bands) {
          if (lon >= a && lon <= b) {
            land = true;
            break;
          }
        }
      }
      row.push(land ? '█' : '·');
    }
    grid.push(row);
  }
  return grid;
}

function RenderMap() {
  const grid = useMemo(() => buildWorldMap(MAP_ROWS), []);
  const markerAt = useMemo(() => {
    const m = new Map<string, (typeof MARKERS)[number]>();
    for (const mk of MARKERS) {
      const { x, y } = posOf(mk.lon, mk.lat);
      m.set(`${y}:${x}`, mk);
    }
    return m;
  }, []);
  const overlay = grid.map((r) => [...r]);
  for (const { lon, lat, ch } of MARKERS) {
    const { x, y } = posOf(lon, lat);
    overlay[y][x] = ch;
  }
  const ocean = 'rgba(255,255,255,0.10)';
  const land = 'rgba(52,211,153,0.55)';
  const rows = overlay.map((row, ry) => (
    <div key={ry} className="whitespace-nowrap leading-[1.35]">
      {row.map((ch, cx) => {
        const marker = markerAt.get(`${ry}:${cx}`);
        const style = marker ? { color: marker.color, textShadow: `0 0 8px ${marker.color}` } : { color: ch === '█' ? land : ocean };
        return (
          <span key={cx} style={style}>
            {ch}
          </span>
        );
      })}
    </div>
  ));
  return (
    <div className="text-[9px] md:text-[10px] font-mono">{rows}</div>
  );
}

/* ---------- tiny markdown renderer (examples/marked-terminal.js) ---------- */
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const em = (s: string) =>
      s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, j) => {
        if (/^\*\*/.test(part)) return <strong key={j}>{part.slice(2, -2)}</strong>;
        if (/^`/.test(part)) return (
          <span key={j} className="text-[#34d399]">{part.slice(1, -1)}</span>
        );
        return part;
      });
    if (/^# /.test(line)) return (
      <div key={i} className="text-emerald-400 text-sm mb-2"># {em(line.slice(2))}</div>
    );
    if (/^## /.test(line)) return (
      <div key={i} className="text-emerald-400/90 text-[11px] mt-3 mb-1.5 opacity-90">## {em(line.slice(3))}</div>
    );
    const box = line.match(/^[-*] \[( |x)\] (.*)/);
    if (box) {
      const done = box[1] === 'x';
      return (
        <div key={i} className={`text-[11px] leading-relaxed ${done ? 'opacity-80' : 'opacity-100'}`}>
          <span className={done ? 'text-emerald-400' : 'text-[#fbbf24]'}>
            {done ? '☑' : '☐'}
          </span>{' '}
          {em(box[2])}
        </div>
      );
    }
    if (/^[-•]\s/.test(line)) return (
      <div key={i} className="text-[11px] leading-relaxed opacity-85">• {em(line.slice(2))}</div>
    );
    return <div key={i} className="text-[11px] leading-relaxed opacity-80">{em(line)}</div>;
  });
}

const RESUME_MD = `# Batdorj Sukhbaatar
> graphic design · video editing · creative dev

## base
- \`@btdrj.scd\` — instagram
- \`bataabat905@gmail.com\` — mail
- \`ULN · GMT+8\` — base

## featured
- [x] **poster / 2023** — typographic posters
- [x] **origami** — digital illustration
- [x] **clz pre-order** — brand layout
- [ ] next ▲ — motion project`;

/* ============================================================ */
export function ResumeTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [clock, setClock] = useState('00:00:00');
  const [palette, setPalette] = useState(0);
  const [spark, setSpark] = useState([4, 8, 5, 12, 9, 16, 11, 19, 14, 22, 17, 26]);
  const [line, setLine] = useState([12, 18, 15, 26, 21, 34, 28, 40, 33, 46, 42, 55]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting ? (setInView(true), observer.disconnect()) : null,
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const id = setInterval(() => {
      setClock(() => {
        const d = new Date();
        return [d.getHours(), d.getMinutes(), d.getSeconds()]
          .map((n) => String(n).padStart(2, '0')).join(':');
      });
      setPalette((p) => (p + 1) % PALETTE.length);
      setSpark((s) => [...s.slice(1), Math.round(Math.random() * 22) + 3]);
      setLine((s) => [...s.slice(1), Math.round(Math.random() * 34) + 8]);
    }, 1200);
    return () => clearInterval(id);
  }, [inView]);

  const acc = PALETTE[palette];
  const sparkStr = toSparkline(spark);

  const months = ['sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', '2026'];

  return (
    <div
      ref={ref}
      className="border border-[#0000FF]/20 bg-[#0000FF] text-white shadow-[0_20px_60px_-30px_rgba(0,0,255,0.5)]"
      style={{ fontFamily: '"JetBrains Mono", monospace' }}
    >
      {/* —— Title bar —— */}
      <div className="flex items-center px-5 py-3 border-b border-white/10 bg-white/5">
        <div className="flex flex-1 items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]"></span>
        </div>
        <span className="px-3 py-1 rounded-md border border-white/10 bg-black/40 text-[10px] tracking-[0.25em] uppercase text-white/80">
          resume.cv — bash
        </span>
        <div className="flex flex-1 items-center justify-end gap-2 text-[10px] tracking-[0.2em] uppercase opacity-60">
          <span className="text-emerald-400">●</span>
          <span>80×24</span>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-12">
        <div className="text-sm md:text-base leading-relaxed opacity-90">
          <span className="text-emerald-400">batdorj@port</span>
          <span className="opacity-60">:</span>
          <span className="text-sky-400">~</span>
          <span className="opacity-60">$</span> <span className="text-white/90">cat resume.md</span>
        </div>
        <div className="h-5" />

        {/* Map + markdown row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="md:col-span-2 border border-white/15 bg-black/30 p-4">
            <div className="flex items-center justify-between text-[9px] tracking-[0.35em] uppercase opacity-60 mb-2 pb-2 border-b border-white/10">
              <span>▚ server location</span>
              <span className="ascii-flicker">LIVE</span>
            </div>
            <RenderMap />
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] opacity-80">
              {MARKERS.map((m) => (
                <span key={m.lon} className="flex items-center gap-1.5">
                  <span style={{ color: m.color }}>{m.ch}</span>
                  <span className="opacity-70">{m.name}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 border border-white/15 bg-black/30 p-4">
            <div className="flex items-center justify-between text-[9px] tracking-[0.35em] uppercase opacity-60 mb-2 pb-2 border-b border-white/10">
              <span>░ resume.md — marked-terminal</span>
            </div>
            <div className="space-y-1">{renderMarkdown(RESUME_MD)}</div>
          </div>
        </div>

        {/* Line chart + throughput row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
          <div className="md:col-span-3 border border-white/15 bg-black/30 p-4">
            <div className="mb-2 pb-2 border-b border-white/10 flex justify-between text-[9px] tracking-[0.3em] uppercase opacity-60">
              <span>◈ creative activity — 12 months</span>
              <span className="ascii-flicker">LIVE</span>
            </div>
            <div className="flex flex-col gap-[3px] my-1" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((r) => {
                const threshold = Math.max(...line) - (Math.max(...line) / 4) * r;
                return (
                  <div key={r} className="flex items-center whitespace-nowrap text-[10px] leading-none">
                    {line.map((v, i) => (
                      <span
                        key={i}
                        className="flex-1 text-center"
                        style={{ color: PALETTE[(i + palette) % PALETTE.length], opacity: v >= threshold ? 1 : 0.06 }}
                      >
                        ▐
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[9px] opacity-50">
              {months.map((m) => (
                <span key={m} className="flex-1 text-center">{m}</span>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="border border-white/15 bg-black/30 p-4">
              <div className="flex items-center justify-between text-[9px] tracking-[0.35em] uppercase opacity-60 mb-2 pb-2 border-b border-white/10">
                <span>● throughput bits/sec</span>
                <span className="lcd" style={{ color: acc }}>{clock}</span>
              </div>
              <div className="text-lg leading-none tracking-tight" style={{ color: acc }}>
                {sparkStr}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-white/15 bg-black/30 p-3">
                <div className="text-[9px] tracking-[0.35em] uppercase opacity-60 mb-3">◉ storage</div>
                <div
                  className="donut w-14 h-14"
                  style={{ background: `conic-gradient(${acc} 0% 74%, rgba(255,255,255,0.10) 74% 100%)` }}
                >
                  <span className="donut-label" style={{ color: acc }}>74%</span>
                </div>
              </div>
              <div className="border border-white/15 bg-black/30 p-3">
                <div className="text-[9px] tracking-[0.35em] uppercase opacity-60 mb-3">▲ gauge</div>
                <div className="text-[10px] leading-relaxed opacity-80">
                  <div>build <span style={{color: acc}}>{inView ? '●' : '○'}</span></div>
                  <div>deploy <span style={{color: acc}}>{inView ? '●' : '○'}</span></div>
                  <div>ship <span style={{color: acc}}>{palette % 2 ? '●' : '○'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Processes + log row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-white/15 bg-black/30 p-4">
            <div className="text-[9px] tracking-[0.35em] uppercase opacity-60 mb-4">◆ active processes</div>
            <div className="space-y-1 text-[11px]">
              {PROCESSES.map((row, i) => (
                <div key={row.p} className="flex justify-between opacity-80">
                  <span>{row.p}</span>
                  <span style={{ color: PALETTE[(i + palette) % PALETTE.length] }}>cpu {row.cpu}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/15 bg-black/30 p-4">
            <div className="text-[9px] tracking-[0.35em] uppercase opacity-60 mb-4">⬡ server log</div>
            <div className="space-y-1 text-[10px] leading-relaxed opacity-80">
              <div><span className="text-emerald-400">[ok]</span> gsap.reveal() run at /#intro</div>
              <div><span className="text-emerald-400">[ok]</span> resume.md rendered</div>
              <div><span className="text-emerald-400">[ok]</span> map markers plotted</div>
              <div><span className="text-[#FEBC2E]">[..]</span> og-image cached <span className="opacity-40">retry 1…</span></div>
              <div className="caret align-middle" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm md:text-base opacity-90">
          <span className="text-emerald-400">$</span> exit 0
          <span className="caret align-middle" />
        </div>
      </div>

      {/* —— Status bar —— */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-white/10 bg-white/5 text-[9px] tracking-[0.2em] uppercase opacity-60">
        <span>◉ bash — ready</span>
        <span className="hidden md:inline">utf-8 · 12 months live</span>
        <span>ln 1, col 1</span>
      </div>
    </div>
  );
}