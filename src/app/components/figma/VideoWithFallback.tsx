import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

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
 * Optimized Video Component for Vite + React
 * Features:
 * - Poster image + click-to-play (no autoplay → no stutter on scroll)
 * - Intersection Observer -> video metadata only loads when near viewport
 * - WebM (VP9) source first, MP4 (H.264) fallback for Safari/iOS
 * - Lazy / priority poster loading (mirrors OptimizedImage)
 * - Native controls after play, replay affordance when paused/ended
 */
export function VideoWithFallback({
  video,
  title,
  className = '',
  aspect = 'aspect-video',
  priority = false,
}: VideoWithFallbackProps) {
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [hasStarted, setHasStarted] = useState(false);
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

  useEffect(() => {
    if (!hasStarted) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      setHasStarted(false);
    });
  }, [hasStarted]);

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasStarted(true);
  };

  const handleEnded = () => {
    setHasStarted(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#0000FF]/10 ${aspect} ${className}`}
    >
      {/* Poster: lazy-loads and only loads metadata for the video until played */}
      {!hasStarted ? (
        <>
          <img
            src={video.poster}
            alt={`${title} preview`}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isNearViewport && (
            <video
              ref={videoRef}
              preload="metadata"
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={handleEnded}
            >
              {video.webm && <source src={video.webm} type="video/webm" />}
              <source src={video.mp4} type="video/mp4" />
            </video>
          )}
          {/* Play button */}
          <button
            type="button"
            aria-label={`Play ${title}`}
            onClick={handlePlay}
            className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-md border border-white/30 rounded-full text-white text-[9px] tracking-[0.25em] uppercase hover:bg-white hover:text-[#0000FF] transition-all duration-300 group-hover:scale-110 z-30 cursor-pointer"
          >
            <Play size={14} strokeWidth={2} className="fill-current" />
            Play
          </button>
        </>
      ) : (
        <video
          ref={videoRef}
          preload="auto"
          controls
          autoPlay
          playsInline
          poster={video.poster}
          className="absolute inset-0 w-full h-full object-cover z-40 cursor-pointer"
          aria-label={title}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

export default VideoWithFallback;