import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { OptimizedImage } from './components/figma/OptimizedImage';
import { useState, useEffect, useRef } from 'react';
import { Star, Send } from 'lucide-react';
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
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);

      const sections = ['intro', 'about', 'portfolio', 'contact'];
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
  const projects = [
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
    }
  ];

  return (
    <div className="min-h-screen bg-[#0000FF] text-white">
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
      <nav className="fixed top-0 left-0 right-0 px-6 md:px-12 py-6 bg-[#0000FF]/95 backdrop-blur-sm z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs tracking-widest">
          <div>PORTFOLIO — APR 2026</div>
          <div className="flex gap-8">
            <button
              onClick={() => scrollToSection('intro')}
              className={`relative transition-all duration-300 hover:tracking-[0.2em] ${
                activeSection === 'intro' ? 'opacity-100' : 'opacity-70'
              }`}
            >
              INTRODUCTION
              {activeSection === 'intro' && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className={`relative transition-all duration-300 hover:tracking-[0.2em] ${
                activeSection === 'about' ? 'opacity-100' : 'opacity-70'
              }`}
            >
              ABOUT ME
              {activeSection === 'about' && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className={`relative transition-all duration-300 hover:tracking-[0.2em] ${
                activeSection === 'portfolio' ? 'opacity-100' : 'opacity-70'
              }`}
            >
              PORTFOLIO
              {activeSection === 'portfolio' && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
              )}
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className={`relative transition-all duration-300 hover:tracking-[0.2em] ${
                activeSection === 'contact' ? 'opacity-100' : 'opacity-70'
              }`}
            >
              RESUME
              {activeSection === 'contact' && (
                <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white animate-[slideIn_0.3s_ease-out]"></span>
              )}
            </button>
          </div>
          <div className="text-right">bataabat905@gmail.com</div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="intro" className="min-h-screen px-6 py-24 md:px-12 lg:px-24 flex flex-col items-center justify-center relative overflow-hidden bg-[#0000FF]">
        {/* Subtle background texture/elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] border border-white/20 rounded-full blur-3xl"></div>
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
            <span className="text-[120px] md:text-[220px] lg:text-[320px] leading-[0.8] select-none" style={{ fontFamily: '"UnifrakturMaguntia", serif', fontWeight: 400 }}>
              P
            </span>
            <span className="text-[80px] md:text-[150px] lg:text-[200px] font-serif leading-[0.8] tracking-tight uppercase" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}>
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
            <div className="flex items-center gap-2 px-6 py-3 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white hover:text-[#0000FF] transition-all duration-500 cursor-pointer group" onClick={() => scrollToSection('about')}>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-light">
                ( A BRIEF INTRODUCTION )
              </span>
            </div>
          </div>

          {/* Bottom Line: FOLIO with stylized F */}
          <div
            data-animate
            id="hero-line-2"
            className={`flex items-baseline justify-center gap-2 md:gap-4 transition-all duration-700 delay-400 ${
              visibleElements.has('hero-line-2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
          >
            <span className="text-[120px] md:text-[220px] lg:text-[320px] leading-[0.8] select-none" style={{ fontFamily: '"UnifrakturMaguntia", serif', fontWeight: 400 }}>
              F
            </span>
            <span className="text-[80px] md:text-[150px] lg:text-[200px] font-serif leading-[0.8] tracking-tight uppercase" style={{ fontFamily: '"Playfair Display", serif', fontWeight: 300 }}>
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
            <div className="flex items-center gap-2 px-8 py-3 border border-white/30 rounded-full backdrop-blur-sm hover:bg-white hover:text-[#0000FF] transition-all duration-500 cursor-pointer group" onClick={() => scrollToSection('about')}>
              <span className="text-[10px] md:text-xs tracking-[0.3em] font-light">
                ( ABOUT ME )
              </span>
            </div>
          </div>

          {/* Welcome Text */}
          <div
            data-animate
            id="hero-welcome"
            className={`mt-24 text-sm md:text-base tracking-[0.5em] font-light opacity-50 transition-all duration-1000 delay-800 ${
              visibleElements.has('hero-welcome') ? 'opacity-50 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            WELCOME TO MY SPACE
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="min-h-screen px-6 py-32 md:px-12 lg:px-24 bg-white text-[#0000FF] border-t border-[#0000FF]/10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0000FF]/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative z-10">
          {/* Left Side: Large Editorial Title */}
          <div className="lg:col-span-5">
            <h2 
              data-animate 
              id="about-title-new"
              className={`text-[100px] md:text-[150px] lg:text-[180px] font-serif italic leading-[0.85] transition-all duration-700 ${
                visibleElements.has('about-title-new') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
              style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
            >
              About<br/>Me
            </h2>
            
            <div className="mt-16 h-[1px] bg-[#0000FF] w-32"></div>
            
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF]"></span>
                    Freelance Graphic Design
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF]"></span>
                    Event & Poster Design
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF]"></span>
                    Identity & Logo Systems
                  </li>
                  <li className="flex items-center gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0000FF]"></span>
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
                  <div className="flex flex-wrap gap-x-12 gap-y-8">
                    <div className="space-y-3">
                      <span className="text-[10px] tracking-widest uppercase block opacity-40">Creative Toolkit</span>
                      <div className="flex flex-wrap gap-3">
                        {['Illustrator', 'Photoshop', 'Premiere Pro', 'Figma'].map(skill => (
                          <span key={skill} className="text-xs font-medium border-b border-[#0000FF]/20 pb-1">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="portfolio" className="px-6 py-24 md:px-12 lg:px-24 bg-[#0000FF]">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-24 items-start">
            {projects.map((project, index) => (
              <div
                key={index}
                data-animate
                id={`project-${index}`}
                className={`group cursor-pointer transition-all duration-700 ${
                  visibleElements.has(`project-${index}`) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                } ${
                  index % 4 === 0 ? 'lg:col-span-8' : index % 4 === 3 ? 'lg:col-span-7' : index % 4 === 1 ? 'lg:col-span-4' : 'lg:col-span-5'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden bg-white/5 border border-white/10 group-hover:border-white/40 transition-all duration-500">
                  <div className="relative h-full w-full overflow-hidden">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      priority={index < 3}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                    />
                  </div>
                  
                  {/* Hover Overlay - Hidden by default, visible only on hover */}
                  <div className="absolute inset-0 bg-[#0000FF] flex flex-col items-center justify-center opacity-0 group-hover:opacity-95 transition-all duration-500 backdrop-blur-md p-10 z-20">
                    <div className="text-white text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
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
                              className="transition-all duration-300 transform hover:scale-125"
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
                </div>
                
                <div className="mt-8 flex justify-between items-start group-hover:px-2 transition-all duration-500">
                  <div className="space-y-1">
                    <h3 className="text-2xl md:text-3xl font-normal leading-tight" style={{fontFamily: '"UnifrakturMaguntia", serif'}}>{project.title}</h3>
                    <div className="flex gap-4 items-center">
                      <span className="text-[10px] tracking-[0.3em] font-light uppercase opacity-50">{project.category}</span>
                    </div>
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

      {/* Resume/Contact Section */}
      <section id="contact" className="px-6 py-32 md:px-12 lg:px-24 bg-[#F5F5F5] text-[#0000FF]">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div 
            data-animate 
            id="final-resume-title"
            className={`text-[80px] md:text-[120px] lg:text-[180px] font-serif italic mb-24 leading-none transition-all duration-700 ${
              visibleElements.has('final-resume-title') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}
          >
            Resume
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-24">
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
                      <span className="w-1 h-1 bg-[#0000FF]/30 rounded-full"></span>
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
                  <a href="mailto:bataabat905@gmail.com" className="block text-2xl md:text-3xl font-light hover:opacity-50 transition-opacity underline underline-offset-8 decoration-1">
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
                <a 
                  href="/batdorj_cv.pdf" 
                  download="Batdorj_Sukhbaatar_CV.pdf"
                  className="group relative px-12 py-6 border border-[#0000FF] overflow-hidden transition-all duration-500 hover:text-white w-full sm:w-auto flex items-center justify-center"
                >
                  <div className="absolute inset-0 bg-[#0000FF] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative text-xs tracking-[0.4em] font-bold uppercase">Download Full CV</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 md:px-12 lg:px-24 bg-[#0000FF] border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs tracking-widest opacity-70">
          <div>© 2026 BATDORJ SUKHBAATAR</div>
          <div>CREATED BY BATDORJ SUKHBAATAR</div>
        </div>
      </footer>
    </div>
  );
}