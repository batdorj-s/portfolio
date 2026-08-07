import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export interface VideoSource {
  mp4: string;
  webm?: string;
  poster: string;
}

interface VideoWithFallbackProps {
  video: VideoSource;
  title: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}

/**
 * Clean Video Component for Vite + React
 * - No native control bar — the video stays clean; click anywhere toggles
 *   play/pause, a faint play/pause glyph appears only on hover.
 * - play() is invoked inside the user-gesture handler so browsers allow
 *   playback WITH sound; never force-muted.
 * - Poster + Play pill until first play; poster returns after the video ends.
 * - WebM (VP9) source first, MP4 (H.264) fallback for Safari/iOS.
 * - Video element always mounted; sources load lazily via preload.
 */
export function VideoWithFallback({
  video,
  title,
  className = '',
  aspect = 'aspect-video',
  priority = false,
}: VideoWithFallbackProps) {
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;

    if (el.paused || el.ended) {
      if (el.ended) {
        el.currentTime = 0;
      }
      el.muted = false;
      el.volume = 1;
      el.play().catch(() => {
        setStarted(true);
        setPlaying(false);
      });
    } else {
      el.pause();
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#0000FF]/10 ${aspect} ${className}`}
    >
      <video
        ref={videoRef}
        preload={isNearViewport ? 'metadata' : 'none'}
        playsInline
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover z-10"
        onPlay={() => {
          setStarted(true);
          setPlaying(true);
        }}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setStarted(false);
          setPlaying(false);
        }}
      >
        {video.webm && <source src={video.webm} type="video/webm" />}
        <source src={video.mp4} type="video/mp4" />
      </video>

      {started && (
        <button
          type="button"
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
          onClick={handleToggle}
          className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
        >
          {playing ? (
            <Pause size={26} strokeWidth={1.5} className="drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
          ) : (
            <Play size={26} strokeWidth={1.5} className="fill-current drop-shadow-[0_0_12px_rgba(0,0,0,0.6)]" />
          )}
        </button>
      )}

      {!started && (
        <>
          <img
            src={video.poster}
            alt={`${title} preview`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover z-20"
          />
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={handleToggle}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-[9px] tracking-[0.25em] uppercase hover:bg-white hover:text-[#0000FF] transition-all duration-300 group-hover:scale-110 z-30 cursor-pointer"
          >
            <Play size={14} strokeWidth={2} className="fill-current" />
            Play
          </button>
        </>
      )}
    </div>
  );
}

export default VideoWithFallback;