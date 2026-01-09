"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, RotateCcw, Check, Info, MapPin, DollarSign, Briefcase, ExternalLink, ChevronLeft, Globe, Mail } from 'lucide-react';

// --- Types & Mock Data ---
const JOBS_DATA = [
  {
    id: 1,
    company: "Vortex Tech",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Vortex",
    title: "Senior Frontend Engineer",
    summary: "Building the next generation of spatial computing interfaces.",
    location: "Remote / San Francisco",
    salary: "$160k - $210k",
    skills: ["React", "TypeScript", "Three.js"],
    description: "Vortex Tech is looking for a creative engineer to lead our frontend team. You will work closely with designers to implement complex 3D visualizations in the browser. We value innovation, performance, and accessibility. You will be responsible for defining our frontend architecture and mentoring junior engineers.",
    website: "vortex.tech",
    email: "careers@vortex.tech"
  },
  {
    id: 2,
    company: "EcoStream",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Eco",
    title: "Product Designer",
    summary: "Designing sustainable supply chain solutions for global impact.",
    location: "New York, NY",
    salary: "$120k - $150k",
    skills: ["Figma", "UX Research", "Design Systems"],
    description: "Join our mission to reduce carbon footprints. You will be responsible for our core B2B dashboard and mobile application used by thousands of logistics providers. We need someone who can translate complex data into simple, intuitive user flows.",
    website: "ecostream.io",
    email: "jobs@ecostream.io"
  },
  {
    id: 3,
    company: "Nexus AI",
    logo: "https://api.dicebear.com/7.x/shapes/svg?seed=Nexus",
    title: "ML Infrastructure Lead",
    summary: "Scaling LLM inference engines for real-time applications.",
    location: "Austin, TX / Hybrid",
    salary: "$180k - $240k",
    skills: ["Python", "Kubernetes", "PyTorch"],
    description: "Nexus AI is at the forefront of the generative revolution. We need an infrastructure expert to manage our GPU clusters and optimize model deployment pipelines. This role is critical to our ability to deliver real-time AI experiences to millions of users worldwide.",
    website: "nexus.ai",
    email: "talent@nexus.ai"
  }
];

export default function App() {
  const [jobs, setJobs] = useState(JOBS_DATA);
  const [history, setHistory] = useState([]);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  
  const currentIndex = jobs.length - 1;
  const currentJob = jobs[currentIndex];

  const handleSwipe = useCallback((direction) => {
    if (jobs.length === 0 || isInfoOpen) return;
    
    // Set direction first so AnimatePresence can capture it for the exit animation
    setSwipeDirection(direction);
    
    const swipedJob = jobs[currentIndex];
    if (direction === 'right') {
      setAcceptedCount(prev => prev + 1);
    }
    
    setHistory([...history, { ...swipedJob, direction }]);
    setJobs(jobs.slice(0, -1));
    setIsInfoOpen(false);
  }, [jobs, history, currentIndex, isInfoOpen]);

  const handleUndo = () => {
    if (history.length === 0 || isInfoOpen) return;
    const lastAction = history[history.length - 1];
    
    if (lastAction.direction === 'right') {
      setAcceptedCount(prev => Math.max(0, prev - 1));
    }
    
    setJobs([...jobs, lastAction]);
    setHistory(history.slice(0, -1));
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
      if (e.key === 'ArrowUp') setIsInfoOpen(prev => !prev);
      if (e.key === 'Escape') setIsInfoOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-[#f0f2f5] p-4 font-sans text-slate-900 overflow-hidden">
      
      {/* Top Header & Counter */}
      <div className="absolute top-4 right-4">
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        <span className="text-sm font-bold text-slate-700">{acceptedCount} Matches</span>
      </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[340px] flex-1 flex items-center justify-center py-4">
      <AnimatePresence mode="popLayout" custom={swipeDirection}>
        {jobs.length > 0 ? (
        jobs.map((job, index) => (
          <JobCard 
          key={job.id}
          job={job}
          isTop={index === currentIndex}
          onSwipe={handleSwipe}
          isInfoOpen={isInfoOpen}
          custom={swipeDirection}
          />
        ))
        ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-10 bg-white rounded-[2.5rem] shadow-xl border border-slate-200"
        >
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-slate-500 font-medium mb-4">You've seen all current listings!</p>
          <button 
          onClick={() => { setJobs(JOBS_DATA); setAcceptedCount(0); setHistory([]); }}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all active:scale-95"
          >
          Refresh Feed
          </button>
        </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="w-full max-w-md flex items-center justify-evenly py-8 gap-2">
      <button 
        onClick={handleUndo}
        disabled={history.length === 0 || isInfoOpen}
        className="p-3 bg-white rounded-full shadow-md text-slate-400 hover:text-amber-500 hover:scale-110 active:scale-95 transition-all disabled:opacity-30"
        aria-label="Undo"
      >
        <RotateCcw size={15} />
      </button>

      <button 
        onClick={() => handleSwipe('left')}
        disabled={isInfoOpen || jobs.length === 0}
        className="p-5 bg-white rounded-full shadow-lg text-rose-500 hover:scale-110 active:scale-90 transition-all border border-slate-100 disabled:opacity-30"
        aria-label="Pass"
      >
        <X size={22} strokeWidth={3} />
      </button>

      <button 
        onClick={() => handleSwipe('right')}
        disabled={isInfoOpen || jobs.length === 0}
        className="p-5 bg-white rounded-full shadow-lg text-emerald-500 hover:scale-110 active:scale-90 transition-all border border-slate-100 disabled:opacity-30"
        aria-label="Like"
      >
        <Check size={22} strokeWidth={3} />
      </button>

      <button 
        onClick={() => setIsInfoOpen(true)}
        disabled={jobs.length === 0}
        className="p-3 bg-white rounded-full shadow-md text-indigo-600 hover:scale-110 active:scale-95 transition-all border border-slate-100 disabled:opacity-30"
        aria-label="More Info"
      >
        <Info size={15} strokeWidth={2.5} />
      </button>
      </div>

      {/* Full Screen Information Panel */}
      <AnimatePresence>
      {isInfoOpen && currentJob && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 right-0 bottom-0 left-0 md:left-64 z-[100] bg-white overflow-y-auto"
          >
        <div className="relative">
          {/* Info Header */}
          <div className="sticky top-0 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-slate-100 z-10">
          <button 
            onClick={() => setIsInfoOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold text-slate-800">Job Details</h2>
          <div className="w-10" /> {/* Spacer */}
          </div>

          {/* Info Content */}
          <div className="p-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-indigo-50 rounded-3xl p-4 mb-4 shadow-inner">
            <img src={currentJob.logo} alt={currentJob.company} className="w-full h-full object-contain" />
            </div>
            <h3 className="text-3xl font-black text-slate-900">{currentJob.title}</h3>
            <p className="text-xl text-indigo-600 font-bold mb-2">{currentJob.company}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Location</p>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <MapPin size={16} /> {currentJob.location}
            </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Salary Range</p>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <DollarSign size={16} /> {currentJob.salary}
            </div>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-lg font-bold text-slate-900 mb-3">About the Role</h4>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {currentJob.description}
            </p>
          </div>

          <div className="mb-10">
            <h4 className="text-lg font-bold text-slate-900 mb-3">Required Stack</h4>
            <div className="flex flex-wrap gap-2">
            {currentJob.skills.map(s => (
              <span key={s} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100">
              {s}
              </span>
            ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]">
            Apply with SwipeHire
            </button>
            <div className="flex gap-4">
            <a href={`mailto:${currentJob.email}`} className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Mail size={18} /> Email
            </a>
            <a href={`https://${currentJob.website}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <Globe size={18} /> Website
            </a>
            </div>
          </div>
          </div>
        </div>
        </motion.div>
      )}
      </AnimatePresence>
    </main>
  );
}


function JobCard({ job, isTop, onSwipe, isInfoOpen, custom }) {
  const x = useMotionValue(0);
  
  // Slower, smoother rotations and transforms
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -120, 0, 120, 200], [0, 1, 1, 1, 0]);
  const crossOpacity = useTransform(x, [-100, -50], [1, 0]);
  const checkOpacity = useTransform(x, [50, 100], [0, 1]);

  const handleDragEnd = (_, info) => {
    if (info.offset.x > 80) onSwipe('right');
    else if (info.offset.x < -80) onSwipe('left');
  };

  // The 'custom' prop from AnimatePresence contains the swipe direction
  const variants = {
    exit: (direction) => {
      const currentX = x.get();
      // If the user was dragging, follow the drag direction
      if (Math.abs(currentX) > 20) {
        return {
          x: currentX < 0 ? -600 : 600,
          opacity: 0,
          rotate: currentX < 0 ? -30 : 30,
          transition: { duration: 1 }
        };
      }
      // If triggered by button, use the custom direction
      return {
        x: direction === 'left' ? -600 : 600,
        opacity: 0,
        rotate: direction === 'left' ? -30 : 30,
        transition: { duration: 1 }
      };
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, zIndex: isTop ? 50 : 0 }}
      drag={isTop && !isInfoOpen ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: isTop ? 1 : 0.92, 
        opacity: 1,
        y: isTop ? 0 : 15,
      }}
      variants={variants}
      custom={custom}
      exit="exit"
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 20
      }}
      className="absolute w-full h-full max-h-[580px] bg-white rounded-[2.8rem] shadow-2xl border border-slate-100 overflow-hidden cursor-grab active:cursor-grabbing will-change-transform"
    >
      {/* Swipe Overlays */}
      <motion.div style={{ opacity: crossOpacity }} className="absolute top-10 right-10 z-20 pointer-events-none">
        <div className="border-4 border-rose-500 text-rose-500 font-black text-3xl px-4 py-2 rounded-xl rotate-12">PASS</div>
      </motion.div>
      <motion.div style={{ opacity: checkOpacity }} className="absolute top-10 left-10 z-20 pointer-events-none">
        <div className="border-4 border-emerald-500 text-emerald-500 font-black text-3xl px-4 py-2 rounded-xl -rotate-12">HIRE</div>
      </motion.div>

      <div className="flex flex-col h-full">
        {/* Visual Header */}
        <div className="relative h-[45%] bg-slate-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5" />
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="z-10 bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100"
          >
            <img src={job.logo} alt={job.company} className="w-16 h-16 object-contain" />
          </motion.div>
          <div className="absolute bottom-6 left-6 z-10">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              Featured Role
            </span>
          </div>
        </div>

        {/* Textual Content */}
        <div className="flex-1 p-8 flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-indigo-600 tracking-tight mb-1">{job.company}</h2>
            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-3">{job.title}</h3>
          </div>

          <div className="space-y-2 mb-6 text-slate-500 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" /> {job.location}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={16} className="text-slate-400" /> {job.salary}
            </div>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 italic">
            "{job.summary}"
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {job.skills.slice(0, 3).map(skill => (
              <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}