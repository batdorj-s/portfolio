import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { OptimizedImage } from './components/figma/OptimizedImage';
import { VideoWithFallback } from './components/figma/VideoWithFallback';
import { useState, useEffect, useRef } from 'react';
import { Star, Send, ArrowUpRight, Instagram, ArrowUp, X, ArrowDown } from 'lucide-react';
import { Magnetic } from './components/figma/Magnetic';
import { CustomCursor } from './components/figma/CustomCursor';
import { Splash } from './components/figma/Splash';
import { SectionNav } from './components/figma/SectionNav';
import { CardSpotlight } from './components/figma/CardSpotlight';
import { ResumeTerminal } from './components/figma/ResumeTerminal';
import { SectionLabel } from './components/figma/SectionLabel';
import { Counter } from './components/figma/Counter';
import { Toaster, toast } from 'sonner';
import { useTypewriter } from './components/figma/useTypewriter';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import emailjs from '@emailjs/browser';

export default function App() {
  const [activeSection, setActiveSection] = useState('intro');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [hoverRating, setHoverRating] = useState<Record<number, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});
  const [activeFeedback, setActiveFeedback] = useState<Record<number, string>>({});
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Record<number, boolean>>({});
  const [splashVisible, setSplashVisible] = useState(true);
  const [isTouch, setIsTouch] = useState(false);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const [clock, setClock] = useState('');
  const [easterEgg, setEasterEgg] = useState(false);
  const eggBuffer = useRef('');
  const rootRef = useRef<HTMLDivElement>(null);
  const typedWelcome = useTypewriter('WELCOME — САЙН БАЙНА УУ', 70, true, 0);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Ulaanbaatar',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const update = () => setClock(formatter.format(new Date()));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcuts — P/A/C/R/T
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const tag = (el?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el?.isContentEditable) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === 'p') scrollToSection('portfolio');
      else if (key === 'a') scrollToSection('about');
      else if (key === 'c' || key === 'r') scrollToSection('contact');
      else if (key === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  // Easter egg — type "batdorj" anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement as HTMLElement | null;
      const tag = (el?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || el?.isContentEditable) return;
      eggBuffer.current = (eggBuffer.current + e.key.toLowerCase()).slice(-7);
      if (eggBuffer.current === 'batdorj') {
        setEasterEgg(true);
        eggBuffer.current = '';
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close easter egg with ESC
  useEffect(() => {
    if (!easterEgg) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setEasterEgg(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [easterEgg]);

  const sendFeedback = async (index: number) => {
    const project = projects[index];
    const rating = ratings[index] || 0;
    const message = activeFeedback[index];

    try {
      await emailjs.send(
        'service_d41fe36', 
        'template_8as9554',
        {
          project_title: project.title,
          rating: rating,
          message: message,
        },
        'YNoD72h4uwgAHgApl'
      );
      
      setFeedbacks(prev => ({ ...prev, [index]: message }));
      setSubmittedFeedbacks(prev => ({ ...prev, [index]: true }));
    } catch (error) {
      console.error('Failed to send feedback:', error);
      alert('Failed to send feedback. Please try again later.');
    }
  };

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setOpenProject(null);

      const sections = ['intro', 'about', 'portfolio', 'instagram', 'contact'];
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    console.log(
      '%cYou found the source — good instincts.',
      'color:#0000FF;font-size:13px;font-weight:700;'
    );
    console.log(
      '%c@btdrj.scd — designed & built by Batdorj Sukhbaatar (React + Vite)',
      'color:#333;font-size:11px;'
    );
    console.log(
      '%c$ curl -s https://port.batdorj.s/whoami',
      'color:#0000FF;font-size:11px;font-family:monospace;'
    );
  }, []);

  // Scroll reveal for [data-reveal] elements
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [splashVisible]);

  // GSAP intro + parallax
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    // Split-text hero intro once splash is gone
    gsap.fromTo(
      '.hero-letter',
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power4.out', delay: splashVisible ? 2.6 : 0.1 }
    );

    // Parallax drift on .parallax[data-parallax]
    gsap.utils.toArray<HTMLElement>('.parallax').forEach((el) => {
      const amount = el.dataset.parallax ? parseFloat(el.dataset.parallax) : 60;
      gsap.fromTo(
        el,
        { y: 0 },
        {
          y: () => -amount,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });

    // Hero background МОНГОЛ drifts slower than scroll
    gsap.fromTo(
      '.hero-bg-mongol',
      { yPercent: 0 },
      {
        yPercent: 22,
        ease: 'none',
        scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom top', scrub: 1 },
      }
    );

    // Hero PORT / FOLIO scrolls out — fades and drifts up as you leave the intro
    gsap.fromTo(
      '#hero-line-1, #hero-line-2',
      { yPercent: 0, opacity: 1 },
      {
        yPercent: -45,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom 30%', scrub: 1 },
      }
    );
    gsap.fromTo(
      '#intro-tag',
      { yPercent: 0, opacity: 1 },
      {
        yPercent: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#intro', start: 'top top', end: 'bottom 45%', scrub: 1 },
      }
    );

    // Giant outline words tilt gently with scroll
    gsap.utils.toArray<HTMLElement>('.scrub-rotate').forEach((el) => {
      gsap.fromTo(
        el,
        { rotate: -6 },
        {
          rotate: 6,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    });

    return () => {
      gsap.killTweensOf('.hero-letter');
      gsap.killTweensOf('#hero-line-1, #hero-line-2, #intro-tag');
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [splashVisible]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  interface PortfolioProject {
    title: string;
    category: string;
    year: string;
    tools: string;
    description: string;
    image?: string;
    span?: string;
    aspect?: string;
    video?: {
      mp4: string;
      webm: string;
      poster: string;
    };
  }

  const projects: PortfolioProject[] = [
    {
      title: "Poster Design 2023",
      category: "Graphic Design",
      year: "2023",
      tools: "Photoshop, Illustrator",
      description: "Editorial poster design for event communication and visual storytelling.",
      image: "/projects/POST.2023.png"
    },
    {
      title: "Visual Identity System",
      category: "Branding",
      year: "2024",
      tools: "Illustrator, Figma",
      description: "Complete visual identity and card design for professional branding.",
      image: "/projects/CARD.png"
    },
    {
      title: "Creative Illustration",
      category: "Digital Art",
      year: "2023",
      tools: "Illustrator, Procreate",
      description: "Experimental origami-inspired digital illustration exploring form and color.",
      image: "/projects/origami.png"
    },
    {
      title: "Merchandise Concept",
      category: "Fashion Design",
      year: "2023",
      tools: "Photoshop, CLO 3D",
      description: "Custom t-shirt and apparel graphic design for local brands.",
      image: "/projects/tshirt_design.png"
    },
    {
      title: "Event Poster Series",
      category: "Graphic Design",
      year: "2023",
      tools: "Photoshop",
      description: "A series of high-impact posters designed for cultural and youth events.",
      image: "/projects/poster1.png"
    },
    {
      title: "Social Media Campaign",
      category: "Digital Design",
      year: "2023",
      tools: "Photoshop, Illustrator",
      description: "Eye-catching visual content for pre-order announcements and social platforms.",
      image: "/projects/CLZ.PRE.ORDER.png"
    },
    {
      title: "Photo Poster Design",
      category: "Graphic Design",
      year: "2023",
      tools: "Photoshop, Photography",
      description: "Visual composition blending photography with bold graphic elements.",
      image: "/projects/CLZ.PHOTO.POST.png"
    },
    {
      title: "Experimental Poster",
      category: "Graphic Design",
      year: "2023",
      tools: "Photoshop",
      description: "Design study exploring contrast and layout in poster design.",
      image: "/projects/poster2.png"
    },
    {
      title: "Minimalist Poster",
      category: "Graphic Design",
      year: "2023",
      tools: "Illustrator",
      description: "Clean and focused visual communication through minimalist design.",
      image: "/projects/poster3.png"
    },
    {
      title: "Photography Work",
      category: "Photography",
      year: "2024",
      tools: "Camera, Lightroom",
      description: "Original photography focusing on lighting and composition.",
      image: "/projects/IMG_3421.jpeg"
    },
    {
      title: "Daily Edit 2026",
      category: "Video Editing",
      year: "2026",
      tools: "DaVinci Resolve",
      description: "Daily edit cut and finished in DaVinci Resolve — rhythm, pacing and visual storytelling.",
      span: "lg:col-span-12",
      video: {
        mp4: "/videos/daily.mp4",
        webm: "/videos/daily.webm",
        poster: "/videos/daily-poster.jpg"
      }
    },
    {
      title: "Video Edit 01",
      category: "Video Editing",
      year: "2026",
      tools: "DaVinci Resolve",
      description: "Short-form edit cut and finished in DaVinci Resolve Studio.",
      span: "lg:col-span-6",
      video: {
        mp4: "/videos/1.mp4",
        webm: "/videos/1.webm",
        poster: "/videos/1-poster.jpg"
      }
    },
    {
      title: "Video Edit 02",
      category: "Video Editing",
      year: "2026",
      tools: "DaVinci Resolve",
      description: "Short-form edit cut and finished in DaVinci Resolve Studio.",
      span: "lg:col-span-6",
      video: {
        mp4: "/videos/2.mp4",
        webm: "/videos/2.webm",
        poster: "/videos/2-poster.jpg"
      }
    },
    {
      title: "Video Edit 03",
      category: "Video Editing",
      year: "2026",
      tools: "DaVinci Resolve",
      description: "Short-form edit cut and finished in DaVinci Resolve Studio.",
      span: "lg:col-span-6",
      video: {
        mp4: "/videos/3.mp4",
        webm: "/videos/3.webm",
        poster: "/videos/3-poster.jpg"
      }
    },
    {
      title: "Video Edit 04",
      category: "Video Editing",
      year: "2026",
      tools: "DaVinci Resolve",
      description: "Short-form edit cut and finished in DaVinci Resolve Studio.",
      span: "lg:col-span-6",
      video: {
        mp4: "/videos/4.mp4",
        webm: "/videos/4.webm",
        poster: "/videos/4-poster.jpg"
      }
    }
  ];

  return (
    <div ref={rootRef} className="min-h-screen bg-brand text-white">
      <CustomCursor />
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-white/5 z-[100]">
        <div className="relative w-full h-full overflow-visible">
          {/* The Rainbow Line */}
          <div
            className="h-full relative"
            style={{ 
              width: `${scrollProgress}%`,
              background: 'linear-gradient(to right, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #4B0082, #8B00FF, #FF0000)',
              backgroundSize: '200% 100%',
              animation: 'gradientFlow 3s linear infinite'
            }}
          >
            {/* Glowing tip */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-md"></div>
          </div>

          {/* Nyan Cat - Positioned independently to avoid clipping */}
          <div 
            className="absolute top-1/2 z-[110] pointer-events-none"
            style={{ 
              left: `${scrollProgress}%`,
              display: scrollProgress > 0 ? 'block' : 'none',
              transform: 'translate(-50%, -50%)',
              marginTop: '0px',
              animation: 'nyanFloat 0.3s ease-in-out infinite alternate'
            }}
          >
            <img 
              src="/nyan-cat.svg" 
              alt="Nyan Cat" 
              className="w-10 h-auto drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
              style={{ display: 'block', maxWidth: 'none' }} 
            />
          </div>
        </div>
        <style>{`
          @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
          }
          @keyframes nyanFloat {
            0% { transform: translate(-50%, -60%); }
            100% { transform: translate(-50%, -40%); }
          }
        `}</style>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 px-4 md:px-12 py-4 md:py-6 bg-brand/95 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs tracking-widest">
          <div className="hidden md:block">
            <Magnetic strength={0.25}>
              <div className="select-none">PORTFOLIO — APR 2026</div>
            </Magnetic>
          </div>
          <div className="flex gap-3 md:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('intro')}
                className={`relative whitespace-nowrap transition-all duration-300 hover:tracking-[0.2em] ${
                  activeSection === 'intro' ? 'opacity-100' : 'opacity-70'
                }`}
              >
                INTRODUCTION
                {activeSection === 'intro' && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
                )}
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('about')}
                className={`relative whitespace-nowrap transition-all duration-300 hover:tracking-[0.2em] ${
                  activeSection === 'about' ? 'opacity-100' : 'opacity-70'
                }`}
              >
                ABOUT ME
                {activeSection === 'about' && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
                )}
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('portfolio')}
                className={`relative whitespace-nowrap transition-all duration-300 hover:tracking-[0.2em] ${
                  activeSection === 'portfolio' ? 'opacity-100' : 'opacity-70'
                }`}
              >
                PORTFOLIO
                {activeSection === 'portfolio' && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
                )}
              </button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <button
                onClick={() => scrollToSection('contact')}
                className={`relative whitespace-nowrap transition-all duration-300 hover:tracking-[0.2em] ${
                  activeSection === 'contact' ? 'opacity-100' : 'opacity-70'
                }`}
              >
                RESUME
                {activeSection === 'contact' && (
                  <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
                )}
              </button>
            </Magnetic>
          </div>
          <div className="text-right hidden md:block">bataabat905@gmail.com</div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="intro" className="min-h-screen px-6 py-24 md:px-12 lg:px-24 flex flex-col items-center justify-center relative overflow-hidden bg-brand">
        {/* Subtle background texture/elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full blur-3xl"></div>
        </div>
        {/* Film grain */}
        <div className="grain absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" aria-hidden="true"></div>
        {/* Developer blueprint grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '90px 90px',
          }}
        ></div>

        {/* Giant МОНГОЛ background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
          <span
            className="hero-bg-mongol text-[28vw] leading-none text-outline opacity-70"
            style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '0.05em' }}
          >
            МОНГОЛ
          </span>
        </div>

        {/* Vertical Mongolian script accents */}
        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 mglv text-white/15 text-xs md:text-sm hidden md:block pointer-events-none select-none" aria-hidden="true">
          ᠪᠠᠲᠤᠳᠣᠷᠵᠢ
        </div>
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 mglv text-white/15 text-xs md:text-sm hidden md:block pointer-events-none select-none" aria-hidden="true">
          ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ
        </div>

        {/* Corner coordinates */}
        <div
          className="absolute left-6 md:left-12 bottom-6 text-[9px] tracking-[0.35em] uppercase opacity-40 pointer-events-none select-none"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
          data-animate
          id="hero-coords"
        >
          48.07°N / 106.92°E — ULAANBAATAR
        </div>

        {/* Rotating circular badge */}
        <div
          className="absolute right-8 md:right-16 bottom-24 md:bottom-16 w-28 h-28 md:w-36 md:h-36 pointer-events-none select-none"
          aria-hidden="true"
          data-animate
          id="hero-badge"
        >
          <svg viewBox="0 0 100 100" className="spin-slow w-full h-full">
            <defs>
              <path id="badge-circle" d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
            </defs>
            <text className="fill-white/50" style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '8px', letterSpacing: '0.27em' }}>
              <textPath href="#badge-circle">
                SCROLL · GRAPHIC DESIGN · EDITORIAL ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowDown size={16} strokeWidth={1.5} className="text-white/60" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center relative z-10">
          {/* Top Line: PORT with stylized P */}
          <div
            data-animate
            id="hero-line-1"
            className={`flex items-baseline justify-center gap-2 md:gap-4 transition-all duration-700 ${
              visibleElements.has('hero-line-1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="hero-letter text-[120px] md:text-[220px] lg:text-[320px] leading-[0.8] select-none" style={{ fontFamily: '"UnifrakturMaguntia", serif', fontWeight: 400 }}>
              P
            </span>
            <span className="hero-letter text-[80px] md:text-[150px] lg:text-[200px] font-serif leading-[0.8] tracking-[-0.02em] uppercase" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}>
              ort
            </span>
          </div>

          {/* Supporting Text 1: A BRIEF INTRODUCTION */}
          <div
            data-animate
            id="intro-tag"
            className={`my-8 md:my-4 flex items-center gap-4 transition-all duration-700 delay-200 ${
              visibleElements.has('intro-tag') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <Magnetic>
              <div className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white hover:text-brand transition-all duration-500 cursor-pointer group" onClick={() => scrollToSection('about')}>
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-light">
                  ( A BRIEF INTRODUCTION )
                </span>
              </div>
            </Magnetic>
          </div>

          {/* Bottom Line: FOLIO with stylized F */}
          <div
            data-animate
            id="hero-line-2"
            className={`flex items-baseline justify-center gap-2 md:gap-4 transition-all duration-700 delay-400 ${
              visibleElements.has('hero-line-2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="hero-letter text-[120px] md:text-[220px] lg:text-[320px] leading-[0.8] select-none" style={{ fontFamily: '"UnifrakturMaguntia", serif', fontWeight: 400 }}>
              F
            </span>
            <span className="hero-letter text-[80px] md:text-[150px] lg:text-[200px] font-serif leading-[0.8] tracking-[-0.02em] uppercase" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}>
              olio
            </span>
          </div>

          {/* Supporting Text 2: ABOUT ME */}
          <div
            data-animate
            id="about-tag"
            className={`mt-12 md:mt-8 flex items-center gap-4 transition-all duration-700 delay-600 ${
              visibleElements.has('about-tag') ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <Magnetic>
              <div className="flex items-center gap-2 px-8 py-3 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white hover:text-brand transition-all duration-500 cursor-pointer group" onClick={() => scrollToSection('about')}>
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-light">
                  ( ABOUT ME )
                </span>
              </div>
            </Magnetic>
          </div>

          {/* Welcome Text */}
          <div
            data-animate
            id="hero-welcome"
            className={`mt-24 min-h-[1.5em] text-sm md:text-base tracking-[0.5em] font-light opacity-80 transition-all duration-1000 delay-800 ${
              visibleElements.has('hero-welcome') ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {typedWelcome}
            <span className="caret align-middle" />
          </div>

          {/* Scroll Indicator */}
          <div
            data-animate
            id="hero-scroll"
            className={`mt-16 flex flex-col items-center gap-3 transition-all duration-1000 delay-1000 ${
              visibleElements.has('hero-scroll') ? 'opacity-40 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <span className="text-[9px] tracking-[0.5em] uppercase" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              Scroll
            </span>
            <span className="relative block w-px h-10 bg-white/25 overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-4 bg-white" style={{ animation: 'scrollDown 1.6s ease-in-out infinite' }}></span>
            </span>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="min-h-screen px-6 py-32 md:px-12 lg:px-24 bg-white text-brand border-t border-brand/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 mglv text-brand/10 text-sm hidden lg:block pointer-events-none select-none" aria-hidden="true">
          ᠮᠣᠩᠭᠣᠯ
        </div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10">
          {/* Left Side: Large Editorial Title */}
          <div className="lg:col-span-5">
            <div
              className="mb-8 text-[10px] tracking-[0.5em] font-bold uppercase flex items-center gap-3"
              style={{ fontFamily: '"JetBrains Mono", monospace' }}
            >
              <span className="opacity-30">01 / 05</span>
              <span className="opacity-50">МИНИЙ ТУХАЙ</span>
              <span className="h-px w-10 bg-brand/30"></span>
              <span className="opacity-30">about</span>
            </div>
            <h2 
              data-animate 
              id="about-title-new"
              className={`parallax text-[100px] md:text-[150px] lg:text-[180px] font-serif italic leading-[0.85] transition-all duration-700 ${
                visibleElements.has('about-title-new') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              data-parallax="50"
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              About<br/>Me
            </h2>
            
            <div className="mt-16 h-[1px] bg-brand w-32"></div>
            
            <div className="mt-16 space-y-12">
              <div
                data-animate
                id="exp-highlights"
                className={`transition-all duration-700 delay-200 ${
                  visibleElements.has('exp-highlights') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <h4 className="text-[10px] tracking-[0.4em] font-bold mb-6 uppercase opacity-50">Experience Highlights</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    Freelance Graphic Design
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    Event & Poster Design
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    Identity & Logo Systems
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
                    Video Editing & Visual Storytelling
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Side: Professional Bio & Toolkit */}
          <div className="lg:col-span-7 flex flex-col justify-end lg:pb-12">
            <div 
              data-animate 
              id="about-bio"
              className={`transition-all duration-700 delay-300 ${
                visibleElements.has('about-bio') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              <div className="mb-12">
                <span className="text-xs tracking-[0.3em] font-bold uppercase opacity-50 mb-4 block underline underline-offset-8 decoration-1">The Perspective</span>
                <p className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] text-balance">
                  Bridging the gap between <span className="italic font-serif">data-driven insights</span> and <span className="italic font-serif">visual excellence</span>.
                </p>
                <p className="mt-8 text-lg opacity-80 leading-relaxed font-light text-balance">
                  My goal is to create work that is clear, creative, and visually meaningful.
                </p>
              </div>
              
              <div className="space-y-12 mt-20">
                <div>
                  <h4 className="text-[10px] tracking-[0.4em] font-bold mb-8 uppercase opacity-50">The Toolkit</h4>
                  <div
                    data-animate
                    id="skill-bars"
                    className={`space-y-5 transition-all duration-700 delay-200 ${
                      visibleElements.has('skill-bars') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                  >
                    {[
                      { name: 'Illustrator', level: 50 },
                      { name: 'Photoshop', level: 50 },
                      { name: 'Premiere Pro', level: 50 },
                      { name: 'Figma', level: 50 },
                      { name: 'DaVinci Resolve', level: 50 },
                    ].map(skill => (
                      <div key={skill.name}>
                        <div className="flex justify-between items-baseline mb-1.5">
                          <span className="text-xs font-medium">{skill.name}</span>
                          <span className="text-[9px] tracking-widest uppercase opacity-40" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                            {skill.level}%
                          </span>
                        </div>
                        <div className="skill-track h-[3px] w-full">
                          <div
                            className={`h-full bg-brand ${visibleElements.has('skill-bars') ? 'skill-fill' : ''}`}
                            style={{ width: visibleElements.has('skill-bars') ? `${skill.level}%` : '0%' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated counters */}
                <div
                  data-animate
                  id="about-stats"
                  className={`grid grid-cols-3 gap-6 transition-all duration-700 delay-300 ${
                    visibleElements.has('about-stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <Counter end={3} suffix="+" label="Years designing" dark />
                  <Counter end={50} suffix="+" label="Projects shipped" dark />
                  <Counter end={20} suffix="+" label="Happy clients" dark />
                </div>

                {/* Quote */}
                <div
                  data-animate
                  id="about-quote"
                  className={`mt-24 border-l-2 border-brand pl-6 md:pl-8 transition-all duration-700 delay-200 ${
                    visibleElements.has('about-quote') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <p className="text-2xl md:text-4xl font-serif italic leading-snug text-brand/90" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
                    "Make it clear, make it beautiful."
                  </p>
                  <p className="mt-4 text-[9px] tracking-[0.35em] uppercase opacity-40" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                    — DESIGN MANTRA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="px-6 py-24 md:px-12 lg:px-24 bg-brand relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Giant outline WORK */}
          <div
            data-reveal
            className="reveal-up absolute inset-x-0 top-6 pointer-events-none select-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="text-outline grow-hover-solid grow-hover-white scrub-rotate block text-center whitespace-nowrap leading-none text-[24vw]"
              style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '0.08em' }}
            >
              WORK
            </span>
          </div>

          {/* Section heading */}
          <div className="relative z-10 mb-16">
            <SectionLabel index="02 / 05" label="Portfolio" className="mb-6" />
            <h2
              data-animate
              id="work-title"
              className={`parallax text-[64px] md:text-[120px] lg:text-[170px] font-serif italic leading-[0.85] transition-all duration-700 ${
                visibleElements.has('work-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              data-parallax="40"
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              Selected<br />Work
            </h2>
            <div className="mt-10 h-[1px] bg-white/20 w-32"></div>
          </div>

          <div className="flex justify-between items-end mb-16">
            <div>
              <div className="text-xs tracking-widest mb-4 opacity-70">GRAPHIC DESIGN</div>
              <div className="text-xs tracking-widest mb-4 opacity-70">EDITORIAL</div>
              <div className="text-xs tracking-widest mb-4 opacity-70">LAYOUT DESIGN</div>
            </div>
            <div>
              <div className="text-xs tracking-widest mb-4 opacity-70">ILLUSTRATION</div>
              <div className="text-xs tracking-widest mb-4 opacity-70">MOTION GRAPHIC</div>
            </div>
          </div>

          <div className="mb-16 text-[10px] tracking-[0.25em] opacity-40" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
            <span className="opacity-80">$</span> ls ./work — <span className="opacity-80">{projects.length} items</span> · all hand-curated
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
            {projects.map((project, index) => (
              <div
                key={index}
                data-animate
                id={`project-${index}`}
                onClick={() => {
                  if (!isTouch || project.video) return;
                  setOpenProject(prev => (prev === index ? null : index));
                }}
                className={`group cursor-pointer transition-all duration-700 ${
                  visibleElements.has(`project-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${
                  project.span ?? (
                    index % 4 === 0 ? 'lg:col-span-8' : index % 4 === 3 ? 'lg:col-span-7' : index % 4 === 1 ? 'lg:col-span-4' : 'lg:col-span-5'
                  )
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardSpotlight className="relative overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/40 transition-all duration-500">
                  <div className="relative h-full w-full overflow-hidden" data-cursor={project.video ? 'play' : 'view'}>
                    {project.video ? (
                      <VideoWithFallback
                        video={project.video}
                        title={project.title}
                        aspect={project.aspect || 'aspect-video'}
                        className="h-full"
                        priority={index < 3}
                      />
                    ) : (
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        priority={index < 3}
                        className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                      />
                    )}

                    {/* Card watermark — giant outline number */}
                    <div
                      aria-hidden="true"
                      className="absolute top-3 left-4 z-10 pointer-events-none select-none text-white/70 transition-opacity duration-500 group-hover:opacity-20"
                      style={{
                        fontSize: 'clamp(3.5rem, 6vw, 6rem)',
                        lineHeight: '0.8',
                        fontFamily: '"Playfair Display", "Georgia", serif',
                        fontStyle: 'italic',
                        WebkitTextStroke: '1px rgba(255,255,255,0.7)',
                        color: 'transparent',
                      }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  {/* Hover Overlay - Hidden by default, visible only on hover (video cards stay clean) */}
                  {!project.video && (
                  <div
                    className={`absolute inset-0 bg-brand flex flex-col items-center backdrop-blur-md p-6 md:p-10 z-20 transition-all duration-500 ${
                      isTouch && openProject === index
                        ? 'overflow-y-auto overscroll-contain'
                        : 'overflow-hidden justify-center'
                    } ${
                      isTouch
                        ? openProject === index
                          ? 'opacity-95 translate-y-0'
                          : 'opacity-0 pointer-events-none translate-y-full'
                        : 'opacity-100 translate-y-full group-hover:translate-y-0'
                    }`}
                  >
                    {isTouch && openProject === index && (
                      <button
                        type="button"
                        aria-label={`Close ${project.title} details`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenProject(null);
                        }}
                        className="sticky top-2 self-end z-30 w-9 h-9 flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-md hover:bg-white hover:text-brand transition-all duration-300"
                      >
                        <X size={16} strokeWidth={2} />
                      </button>
                    )}
                    <div
                      className="text-white text-center m-auto transition-transform duration-500 ease-out"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 uppercase">
                        {project.title}
                      </h3>
                      <div className="h-px bg-white/30 w-12 mx-auto mb-6"></div>
                      <p className="text-[10px] tracking-[0.4em] font-light uppercase mb-6 opacity-60">{project.category} • {project.year}</p>
                      <p className="text-xs mb-10 opacity-80 max-w-xs mx-auto leading-relaxed font-light">
                        {project.description}
                      </p>
                      
                      {/* Interactive Star Rating */}
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] tracking-[0.3em] font-bold uppercase opacity-50">Rate this project</span>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onMouseEnter={() => setHoverRating(prev => ({ ...prev, [index]: star }))}
                              onMouseLeave={() => setHoverRating(prev => ({ ...prev, [index]: 0 }))}
                              onClick={(e) => {
                                e.stopPropagation();
                                setRatings(prev => ({ ...prev, [index]: star }));
                              }}
                              className="transition-all duration-300 transform hover:scale-125 active:scale-75 hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                            >
                              <Star
                                size={24}
                                strokeWidth={1}
                                className={`${
                                  star <= (hoverRating[index] || ratings[index] || 0)
                                    ? 'fill-white stroke-white'
                                    : 'fill-transparent stroke-white/40'
                                } transition-all duration-300`}
                              />
                            </button>
                          ))}
                        </div>
                        {ratings[index] > 0 && (
                          <span className="text-[10px] italic opacity-70 animate-pulse">Thank you!</span>
                        )}
                      </div>

                      {/* Feedback Comment Section */}
                      <div className="mt-10 w-full max-w-xs transition-all duration-500">
                        {submittedFeedbacks[index] ? (
                          <div className="text-center p-4 border border-white/20 bg-white/5 backdrop-blur-sm">
                            <p className="text-[10px] tracking-widest uppercase opacity-60">Feedback Received</p>
                            <p className="text-xs mt-2 italic">"{feedbacks[index]}"</p>
                          </div>
                        ) : (
                          <div className="relative group/input">
                            <input
                              type="text"
                              value={activeFeedback[index] || ''}
                              onChange={(e) => {
                                e.stopPropagation();
                                setActiveFeedback(prev => ({ ...prev, [index]: e.target.value }));
                              }}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Leave a comment..."
                              className="w-full bg-transparent border-b border-white/30 py-3 pr-10 text-xs font-light placeholder:text-white/40 focus:outline-none focus:border-white transition-colors"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (activeFeedback[index]) {
                                  sendFeedback(index);
                                }
                              }}
                              className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:scale-110 transition-transform"
                            >
                              <Send size={14} className="opacity-50 hover:opacity-100 transition-opacity" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
)}
                </CardSpotlight>

                <div className="mt-8 flex justify-between items-start group-hover:px-2 transition-all duration-500">
                  <div className="space-y-1">
                    <h3 className="text-2xl md:text-3xl font-normal leading-tight" style={{fontFamily: '"UnifrakturMaguntia", serif'}}>{project.title}</h3>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] tracking-[0.3em] font-light uppercase opacity-50">{project.category}</span>
                    </div>
                    {project.video && project.tools && (
                      <div className="pt-2 text-[9px] tracking-[0.3em] font-light uppercase opacity-40" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
                        <span className="opacity-70">&gt;</span> edited with {project.tools}
                      </div>
                    )}
                  </div>
                  <div className="text-[10px] tracking-widest font-light opacity-20 group-hover:opacity-100 transition-opacity">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee Strip */}
      <div className="relative overflow-hidden border-t border-b border-white/10 bg-brand py-6">
        <div className="flex w-max marquee-track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center">
              {['GRAPHIC DESIGN', 'EDITORIAL', 'VIDEO EDITING', 'PHOTOGRAPHY', 'BRANDING', 'LOGOS'].map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-8 px-8 text-[11px] tracking-[0.4em] font-light uppercase opacity-60"
                  style={{ fontFamily: '"JetBrains Mono", monospace' }}
                >
                  {t}
                  <span className="text-white/30 text-[6px]">●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Section */}
      <section id="instagram" className="px-6 py-32 md:px-12 lg:px-24 bg-brand border-t border-white/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-15%] right-[-10%] w-[45%] h-[45%] border border-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-15%] left-[-10%] w-[45%] h-[45%] border border-white/20 rounded-full blur-3xl"></div>
        </div>

        <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 mglv text-white/10 text-sm hidden md:block pointer-events-none select-none" aria-hidden="true">
          ᠤᠭᠠᠯᠵᠠ
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div
            data-animate
            id="ig-kicker"
            className={`flex justify-center items-center gap-3 transition-all duration-700 ${
              visibleElements.has('ig-kicker') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Instagram size={16} className="opacity-50" />
            <span className="text-[10px] tracking-[0.4em] font-light uppercase opacity-30">03 / 05</span>
            <span className="text-[10px] tracking-[0.4em] font-light uppercase opacity-50">( FOLLOW ALONG )</span>
          </div>

          <a
            href="https://www.instagram.com/btdrj.scd/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram @btdrj.scd"
            className="group block mt-12"
            data-animate
            id="ig-handle"
          >
            <span
              className={`parallax block text-[30px] sm:text-[64px] md:text-[130px] lg:text-[170px] leading-none tracking-tight select-none transition-all duration-500 group-hover:opacity-60 ${
                visibleElements.has('ig-handle') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              data-parallax="40"
              style={{ fontFamily: '"UnifrakturMaguntia", serif' }}
            >
              @btdrj.scd
            </span>
          </a>

          <div
            data-animate
            id="ig-cta"
            className={`mt-16 flex justify-center transition-all duration-700 delay-200 ${
              visibleElements.has('ig-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Magnetic>
              <a
                href="https://www.instagram.com/btdrj.scd/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 px-10 py-5 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white hover:text-brand transition-all duration-500"
              >
                <span className="text-[10px] tracking-[0.4em] font-bold uppercase">SEE MORE ON INSTAGRAM</span>
                <ArrowUpRight size={18} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Magnetic>
          </div>
        </div>
      </section>

      {/* Resume/Contact Section */}
      <section id="contact" className="px-6 py-32 md:px-12 lg:px-24 bg-[#F5F5F5] text-brand">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="relative z-10">
            <SectionLabel index="04 / 05" label="Contact" dark className="mb-6" />
          </div>
          <div
            data-reveal
            className="reveal-up inline-flex items-center gap-3 px-5 py-2.5 border border-brand/20 rounded-full mb-14"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
            <span className="text-[10px] tracking-[0.4em] font-bold uppercase">Open to opportunities</span>
          </div>

          <div className="relative">
            {/* Giant outline CONTACT */}
            <div
              data-reveal
              className="reveal-up absolute inset-x-0 pointer-events-none select-none overflow-hidden"
              aria-hidden="true"
            >
              <span
                className="text-outline-dark grow-hover-solid grow-hover-blue scrub-rotate block text-center whitespace-nowrap leading-none text-[18vw]"
                style={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, letterSpacing: '0.06em' }}
              >
                CONTACT
              </span>
            </div>

          <div 
            data-animate 
            id="final-resume-title"
            className={`parallax text-[80px] md:text-[120px] lg:text-[180px] font-serif italic mb-24 leading-none transition-all duration-700 relative z-10 ${
              visibleElements.has('final-resume-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            data-parallax="60"
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            Resume
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24 relative z-10">
            {/* Left Column: Skills */}
            <div className="lg:col-span-7">
              <div 
                data-animate 
                id="skills-list"
                className={`transition-all duration-700 delay-200 ${
                  visibleElements.has('skills-list') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <h4 className="text-[10px] tracking-[0.5em] font-bold mb-12 uppercase opacity-40">Skills & Toolkit</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {[
                    "Graphic Design", "Poster Design", "Logo Design", 
                    "Social Media Design", "Visual Storytelling", "Video Editing", 
                    "Photography", "Adobe Illustrator", 
                    "Adobe Photoshop", "Adobe Premiere Pro", "Figma", 
                    "CLO 3D"
                  ].map((skill, index) => (
                    <div key={index} className="text-base md:text-lg font-light flex items-center gap-3">
                      <span className="w-1 h-1 bg-brand/30 rounded-full"></span>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Contact & CV */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div 
                data-animate 
                id="contact-info"
                className={`transition-all duration-700 delay-400 ${
                  visibleElements.has('contact-info') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <h4 className="text-[10px] tracking-[0.5em] font-bold mb-12 uppercase opacity-40">Contact</h4>
                <div className="space-y-8">
                  <a
                    href="mailto:bataabat905@gmail.com"
                    onClick={(e) => {
                      e.preventDefault();
                      navigator.clipboard
                        .writeText('bataabat905@gmail.com')
                        .then(() => toast.success('Email copied to clipboard', { description: 'bataabat905@gmail.com' }))
                        .catch(() => toast.error('Could not copy — emailing you instead', { description: 'bataabat905@gmail.com' }));
                      window.location.href = 'mailto:bataabat905@gmail.com';
                    }}
                    className="block text-2xl md:text-3xl font-light hover:opacity-50 transition-opacity underline underline-offset-8 decoration-1"
                  >
                    bataabat905@gmail.com
                  </a>
                  <p className="text-xl font-light opacity-70">Ulaanbaatar, Mongolia</p>
                  
                  <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
                    <a href="https://www.instagram.com/batdorj_0818/" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest font-bold uppercase hover:opacity-50 transition-opacity">Instagram</a>
                    <a href="https://www.facebook.com/s.batdorz.637718/" target="_blank" rel="noopener noreferrer" className="text-xs tracking-widest font-bold uppercase hover:opacity-50 transition-opacity">Facebook</a>
                  </div>
                </div>
              </div>

              <div 
                data-animate 
                id="cv-action"
                className={`mt-24 transition-all duration-700 delay-600 ${
                  visibleElements.has('cv-action') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Magnetic className="w-full sm:w-auto">
                  <a
                    href="/batdorj_cv.pdf"
                    download="Batdorj_Sukhbaatar_CV.pdf"
                    className="group relative px-12 py-6 border border-brand overflow-hidden transition-all duration-500 hover:text-white w-full sm:w-auto flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-brand translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <span className="relative text-xs tracking-[0.4em] font-bold uppercase">Download Full CV</span>
                    <ArrowDown size={16} strokeWidth={2} className="relative ml-3 transition-transform duration-500 group-hover:translate-y-1" />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Resume Terminal */}
          <div data-reveal className="reveal-up mt-28 relative z-10">
            <ResumeTerminal />
          </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 pt-12 pb-64 md:px-12 lg:px-24 bg-brand border-t border-white/10 relative overflow-hidden">
        <div className="absolute right-6 bottom-6 mglv text-white/10 text-xs hidden md:block pointer-events-none select-none" aria-hidden="true">
          ᠤᠯᠠᠭᠠᠨᠪᠠᠭᠠᠲᠤᠷ
        </div>
        {/* Giant outline signature */}
        <div
          aria-hidden="true"
          className="text-outline grow-hover grow-hover-white absolute left-1/2 -translate-x-1/2 bottom-0 w-full text-center font-serif italic leading-none pointer-events-none select-none"
          style={{ fontSize: '17vw', fontFamily: '"Playfair Display", "Georgia", serif' }}
        >
          BATDORJ.S
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest opacity-70 relative z-10" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
          <div>© 2026 BATDORJ SUKHBAATAR</div>
          <div className="text-[9px] opacity-50">REACT + VITE · BUILT BY HAND · @btdrj.scd</div>
        </div>
      </footer>

      {/* Back to Top */}
      {scrollProgress > 4 && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 md:right-6 z-40 w-11 h-11 flex items-center justify-center border border-white/30 rounded-full bg-brand/85 backdrop-blur-md hover:bg-white hover:text-brand transition-all duration-300"
        >
          <span
            aria-hidden
            className="absolute -inset-[3px] rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(currentColor ${scrollProgress}%, transparent 0)`,
              WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
              mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px))',
            }}
          />
          <ArrowUp size={16} strokeWidth={2} />
        </button>
      )}

      {/* Dev Status Bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 md:px-6 py-2 bg-brand/85 backdrop-blur-md border-t border-white/10 flex justify-between items-center text-[9px] tracking-[0.25em] select-none"
        style={{ fontFamily: '"JetBrains Mono", monospace' }}
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span className="uppercase opacity-70">port.batdorj.s</span>
          <span className="hidden sm:inline opacity-30">v2.1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline opacity-30">{clock} — Ulaanbaatar, MN</span>
          <span className="opacity-70">$ npm run creative</span>
          <span className="hidden sm:inline w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        </div>
      </div>

      {/* Section rail */}
      <SectionNav active={activeSection} onNavigate={scrollToSection} />

      {/* Toast notifications */}
      <Toaster position="top-center" theme="light" toastOptions={{ duration: 3200 }} />

      {/* Easter egg */}
      {easterEgg && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center bg-brand/90 backdrop-blur-md p-6"
          role="dialog"
          aria-label="Easter egg"
          onClick={() => setEasterEgg(false)}
        >
          <div
            className="relative w-full max-w-lg border border-white/25 bg-[#0a0a0a] p-6 md:p-10 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6 text-[9px] tracking-[0.3em] opacity-60" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              <span>EASTER EGG UNLOCKED</span>
              <button
                type="button"
                aria-label="Close easter egg"
                onClick={() => setEasterEgg(false)}
                className="w-8 h-8 flex items-center justify-center border border-white/30 hover:bg-white hover:text-brand transition-colors"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
            <pre className="text-[10px] md:text-xs leading-relaxed whitespace-pre overflow-x-auto" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
{String.raw`     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
     █             █
     █  B A T D   █
     █  O R J .S  █
     █             █
     ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

$ find /dev/null -name "ego"
> not found — but found you instead.

You type "batdorj", you get this.
Sun Tzu never said anything about it.`}
            </pre>
            <p className="mt-6 text-[9px] tracking-[0.3em] opacity-40 text-right" style={{ fontFamily: '"JetBrains Mono", monospace' }}>
              PRESS ESC OR CLICK OUTSIDE TO CLOSE
            </p>
          </div>
        </div>
      )}

      {/* Splash loader */}
      {splashVisible && <Splash onFinish={() => setSplashVisible(false)} />}
    </div>
  );
}