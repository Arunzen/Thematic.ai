
import React, { useState, useEffect, useCallback, useRef } from 'react';
import ThemeForm from './components/ThemeForm';
import PreviewFrame from './components/PreviewFrame';
import ThemeSpecs from './components/ThemeSpecs';
import { generateThemeStructure, generateHeroImage, generateLogo } from './services/geminiService';
import { GeneratedThemeState, WebsiteTheme } from './types';
import html2canvas from 'https://esm.sh/html2canvas';

const App: React.FC = () => {
  const [themeState, setThemeState] = useState<GeneratedThemeState>({
    data: null,
    heroImageUrl: null,
    logoUrl: null,
    loading: false,
    error: null,
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const [appCopyFeedback, setAppCopyFeedback] = useState(false);
  const [neuralLogs, setNeuralLogs] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  
  const logContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const steps = [
    "Analyzing brand semantics...",
    "Reimagining visual hierarchy...",
    "Synthesizing creative motifs...",
    "Validating neural contrast ratios...",
    "Injecting character DNA...",
    "Generating brand identity assets..."
  ];

  const processingMessages = [
    "Applying WCAG 2.1 Contrast Logic...",
    "Parsing Pearl spectrum...",
    "Refining text legibility...",
    "Initializing lavender gradients...",
    "Optimizing visual weights...",
    "Calculating semantic luminance...",
    "Retrieving style tokens...",
    "Synthesizing unique logo vector..."
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (themeState.loading) {
      const interval = setInterval(() => {
        const msg = processingMessages[Math.floor(Math.random() * processingMessages.length)];
        setNeuralLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-8));
      }, 1200);
      return () => clearInterval(interval);
    } else {
      setNeuralLogs([]);
    }
  }, [themeState.loading]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [neuralLogs]);

  const handleGenerate = useCallback(async (industry: string, aesthetic: string, businessName: string, subStyle: string, palettePref: string, websiteUrl?: string) => {
    setThemeState(prev => ({ ...prev, loading: true, error: null, data: null, heroImageUrl: null, logoUrl: null }));
    
    try {
      // Step 1: Generate Content Structure
      const structure = await generateThemeStructure(industry, aesthetic, businessName, subStyle, palettePref, websiteUrl);
      setThemeState(prev => ({ ...prev, data: structure }));

      // Step 2: Generate High Fidelity Hero Image & Logo
      try {
        const [imageUrl, logoUrl] = await Promise.all([
          generateHeroImage(structure),
          generateLogo(structure.businessName, structure.industry, structure.aesthetic)
        ]);
        setThemeState(prev => ({ ...prev, heroImageUrl: imageUrl, logoUrl: logoUrl, loading: false }));
      } catch (assetErr) {
        console.warn("Visual assets synthesis failed partially, proceeding with available data.");
        setThemeState(prev => ({ ...prev, loading: false }));
      }
      
    } catch (err: any) {
      let friendlyError = "The Neural Engine encountered an unexpected sequence interrupt.";
      
      if (err.message?.includes("Neural Capacity Exhausted")) {
        friendlyError = "Neural link limit reached. Please reset your session credits to continue generation.";
      } else if (err.message?.includes("API Key not detected")) {
        friendlyError = "System Identity Error: Neural link requires a valid API key configuration.";
      } else if (err.message?.includes("429") || err.message?.toLowerCase().includes("quota")) {
        friendlyError = "The AI model is currently under high demand. Please wait a few moments and attempt to re-sync.";
      } else if (err.message?.includes("parsing") || err.message?.includes("JSON")) {
        friendlyError = "Data synthesis failed: The generated manifest was malformed. Please try a different aesthetic directive.";
      }

      setThemeState({
        data: null,
        heroImageUrl: null,
        logoUrl: null,
        loading: false,
        error: friendlyError,
      });
    }
  }, []);

  useEffect(() => {
    let interval: any;
    if (themeState.loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % steps.length);
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [themeState.loading]);

  const handleExportJSON = () => {
    if (!themeState.data) return;
    const blob = new Blob([JSON.stringify(themeState.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thematic-${themeState.data.businessName.toLowerCase()}.json`;
    a.click();
  };

  const handleExportCode = () => {
    if (!themeState.data) return;
    const theme = themeState.data;
    const home = theme.pages.home;
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${theme.businessName} | ${theme.industry}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Plus+Jakarta+Sans:wght@700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: ${theme.colors.primary};
            --secondary: ${theme.colors.secondary};
            --accent: ${theme.colors.accent};
            --background: ${theme.colors.background};
            --text: ${theme.colors.text};
            --card: ${theme.colors.card};
        }
        body { 
            background-color: var(--background); 
            color: var(--text); 
            font-family: '${theme.typography.bodyFont}', sans-serif;
        }
        h1, h2, h3, h4, h5, h6 { 
            font-family: '${theme.typography.headingFont}', sans-serif; 
            color: var(--primary);
        }
        .btn-primary {
            background-color: var(--primary);
            color: #fff;
            transition: all 0.3s ease;
        }
        .btn-primary:hover {
            opacity: 0.9;
            transform: translateY(-2px);
        }
        .feature-card {
            background-color: var(--card);
            border: 1px solid var(--accent)22;
            transition: all 0.3s ease;
        }
        .feature-card:hover {
            border-color: var(--accent)55;
            transform: translateY(-5px);
        }
    </style>
</head>
<body class="antialiased">
    <nav class="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <div class="text-3xl font-extrabold tracking-tighter" style="color: var(--primary)">${theme.businessName}</div>
        <div class="hidden md:flex space-x-10 text-sm font-bold uppercase tracking-widest opacity-70">
            <a href="#about" class="hover:opacity-100 transition-opacity">About</a>
            <a href="#services" class="hover:opacity-100 transition-opacity">Services</a>
            <a href="#contact" class="hover:opacity-100 transition-opacity">Contact</a>
        </div>
        <a href="#" class="btn-primary px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl">Get Started</a>
    </nav>

    <main>
        <section class="max-w-7xl mx-auto px-6 py-24 md:py-40 flex flex-col items-center text-center">
            <h1 class="text-5xl md:text-8xl font-extrabold mb-8 leading-tight max-w-5xl">${home.heroTitle}</h1>
            <p class="max-w-2xl text-lg md:text-xl opacity-80 mb-12 leading-relaxed">${home.heroSubtitle}</p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <a href="#" class="btn-primary px-12 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-2xl">Start Now</a>
                <a href="#" class="border-2 border-slate-500/20 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">Documentation</a>
            </div>
        </section>

        <section id="features" class="max-w-7xl mx-auto px-6 py-32">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                ${home.sections.map(section => `
                    <div class="feature-card p-12 rounded-[3rem]">
                        <div class="text-5xl mb-10">${section.icon || '✨'}</div>
                        <h3 class="text-2xl font-extrabold mb-6">${section.heading}</h3>
                        <p class="opacity-70 leading-relaxed text-lg">${section.content}</p>
                    </div>
                `).join('')}
            </div>
        </section>

        <section id="contact" class="max-w-4xl mx-auto px-6 py-32 text-center">
            <h2 class="text-4xl md:text-6xl font-extrabold mb-10">Ready to transform your brand?</h2>
            <div class="p-12 feature-card rounded-[3rem] text-left">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Email Address</label>
                        <input type="email" placeholder="you@company.com" class="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/40">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Service Interest</label>
                        <select class="w-full bg-black/5 border border-black/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/40">
                            <option>Consulting</option>
                            <option>Development</option>
                            <option>Design</option>
                        </select>
                    </div>
                </div>
                <button class="btn-primary w-full mt-10 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl">Send Manifest</button>
            </div>
        </section>
    </main>

    <footer class="border-t border-slate-500/10 py-24 text-center">
        <div class="text-2xl font-extrabold mb-4" style="color: var(--primary)">${theme.businessName}</div>
        <p class="opacity-50 text-xs tracking-widest uppercase mb-10">© 2024 Project Manifest • Generated by Thematic.ai</p>
        <div class="flex justify-center space-x-8 opacity-40 text-xs font-bold uppercase tracking-widest">
            <a href="#" class="hover:opacity-100 transition-opacity">Privacy</a>
            <a href="#" class="hover:opacity-100 transition-opacity">Terms</a>
            <a href="#" class="hover:opacity-100 transition-opacity">Twitter</a>
        </div>
    </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.businessName.toLowerCase().replace(/\s+/g, '-')}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSnapshot = async () => {
    if (!previewRef.current) return;
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null,
      });
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `${themeState.data?.businessName.toLowerCase() || 'theme'}-preview.png`;
      link.click();
    } catch (err) {
      console.error("Snapshot capture failed", err);
    } finally {
      setIsCapturing(false);
    }
  };

  const CustomLogo = () => (
    <svg viewBox="0 0 400 400" className="w-full h-full p-2 group-hover:rotate-45 transition-transform duration-700 ease-in-out">
      <defs>
        <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFCACC" />
          <stop offset="100%" stopColor="#DBC4F0" />
        </linearGradient>
      </defs>
      <g fill="url(#spiralGrad)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((rot) => (
          <path 
            key={rot}
            d="M200,200 c0-50,30-100,80-120 c-40,50-40,110,0,160 S200,200,200,200z" 
            transform={`rotate(${rot} 200 200)`} 
            className="opacity-90"
          />
        ))}
        <circle cx="200" cy="200" r="15" fill="#FAF3F0" className="opacity-40" />
      </g>
    </svg>
  );

  return (
    <div className={`min-h-screen bg-transparent transition-colors duration-500 overflow-x-hidden relative ${isDarkMode ? 'selection:bg-violet-500/30 text-slate-200' : 'selection:bg-violet-500/10 text-slate-800'}`}>
      <header className={`px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-50 backdrop-blur-3xl transition-all ${isDarkMode ? 'bg-[#0a0505]/60' : 'bg-white/60'}`}>
        <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-violet-400 transition-all duration-700 relative overflow-hidden">
            <CustomLogo />
          </div>
          <div className="flex flex-col">
            <h1 className={`text-2xl font-black font-heading tracking-tight leading-none flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Thematic<span className="text-[#DBC4F0]">.ai</span>
            </h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Neural Engine v4.2</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl border transition-all active:scale-90 ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 hover:bg-slate-900/10'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button 
            onClick={() => {
              const baseUrl = window.location.origin + window.location.pathname;
              navigator.clipboard.writeText(baseUrl);
              setAppCopyFeedback(true);
              setTimeout(() => setAppCopyFeedback(false), 2000);
            }}
            className={`px-6 py-3 rounded-2xl border transition-all active:scale-95 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest
              ${appCopyFeedback ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 hover:bg-slate-900/10'}`}
          >
            <span>{appCopyFeedback ? 'Copied' : 'Share Portal'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 lg:py-20 relative flex flex-col items-center space-y-20">
        <div className="text-center space-y-6 max-w-2xl fade-in-up">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
            Contrast Adaptive V4
          </div>
          <h2 className={`text-5xl lg:text-7xl font-black font-heading leading-[1.1] tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Design with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBC4F0] via-[#FFCACC] to-[#FAF3F0] animate-gradient">Neural Precision.</span>
          </h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-lg leading-relaxed font-medium`}>
            Generating high-fidelity website themes that prioritize both branding and universal accessibility.
          </p>
        </div>

        <div className="w-full max-w-2xl fade-in-up">
           <ThemeForm onGenerate={handleGenerate} isLoading={themeState.loading} isDarkMode={isDarkMode} />
        </div>

        <div className="w-full space-y-12 min-h-[400px]">
          {themeState.error && (
            <div className={`p-8 rounded-[2.5rem] border border-red-500/20 bg-red-500/5 flex flex-col items-center text-center space-y-4 fade-in-up`}>
               <h3 className="text-xl font-black font-heading text-red-400">Generation Interrupt</h3>
               <p className={`max-w-md ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{themeState.error}</p>
            </div>
          )}

          {!themeState.data && !themeState.loading && !themeState.error && (
            <div className="h-full min-h-[400px] glass-card rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-slate-600 p-16 text-center group hover:border-violet-500/40 transition-all duration-1000">
              <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center mb-10 group-hover:rotate-12 transition-all duration-700 shadow-2xl relative ${isDarkMode ? 'bg-[#1a0a0a]' : 'bg-slate-200'}`}>
                 <div className="absolute inset-0 bg-violet-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-10 group-hover:opacity-100 group-hover:text-violet-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-black mb-4 font-heading ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Neural Interface Ready</h3>
              <p className="max-w-xs text-slate-500 text-sm leading-relaxed font-medium">Enter brand parameters above to initialize the generation sequence.</p>
            </div>
          )}

          {themeState.data && (
            <div className="space-y-10 fade-in-up">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                    <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className={`text-2xl font-black font-heading ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generated Manifest</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{themeState.data.industry} • {themeState.data.aesthetic}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button 
                    onClick={handleDownloadSnapshot} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center space-x-3 ${isDarkMode ? 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/20 text-violet-600'}`}
                  >
                    <span>{isCapturing ? 'Capturing...' : 'Photo Snapshot'}</span>
                  </button>
                  <button 
                    onClick={handleExportCode} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-xl shadow-emerald-900/20 border-emerald-500/20 active:scale-95`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    <span>Export Code</span>
                  </button>
                  <button 
                    onClick={handleExportJSON} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center space-x-3 ${isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-slate-900/5 border-slate-900/10 text-slate-900'}`}
                  >
                    <span>Manifest JSON</span>
                  </button>
                </div>
              </div>
              <div ref={previewRef} className="rounded-[3rem] overflow-hidden shadow-2xl">
                <PreviewFrame 
                  theme={themeState.data} 
                  heroImage={themeState.heroImageUrl} 
                  logoUrl={themeState.logoUrl} 
                />
              </div>
              <ThemeSpecs theme={themeState.data} isDarkMode={isDarkMode} />
            </div>
          )}

          {themeState.loading && (
             <div className="h-full min-h-[500px] glass-card rounded-[3rem] flex flex-col items-center justify-center space-y-10">
                <div className="relative">
                  <div className="w-32 h-32 border-4 border-violet-500/5 rounded-[2.5rem] animate-pulse"></div>
                  <div className="absolute inset-0 w-32 h-32 border-t-4 border-violet-500 rounded-[2.5rem] animate-spin"></div>
                </div>
                <div className="text-center z-10 px-8 w-full max-w-lg">
                  <h4 className={`text-2xl font-black mb-6 font-heading tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{steps[loadingStep]}</h4>
                  <div ref={logContainerRef} className={`border rounded-2xl p-4 font-mono text-[10px] text-violet-400/80 h-32 overflow-y-auto ${isDarkMode ? 'bg-black/60 border-white/5' : 'bg-slate-900 border-slate-900/10'}`}>
                    {neuralLogs.map((log, i) => <div key={i} className="opacity-80 animate-pulse">{log}</div>)}
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>

      <footer className={`mt-32 py-24 px-10 border-t transition-all ${isDarkMode ? 'border-white/5 bg-[#0a0505]/80 text-slate-500' : 'border-slate-900/5 bg-white text-slate-400'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="flex items-center space-x-5">
                <div className="w-12 h-12 border border-white/10 rounded-2xl flex items-center justify-center">
                  <CustomLogo />
                </div>
                <div className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>THEMATIC<span className="text-[#DBC4F0]">.AI</span></div>
              </div>
              <p className="max-w-md text-base leading-relaxed opacity-60 font-medium">
                The world's premier neural engine for high-fidelity website aesthetic synthesis. We engineer visual identities at the intersection of brand logic and multi-modal intelligence.
              </p>
              <div className="flex space-x-6 pt-2">
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-violet-400 transition-all cursor-pointer group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:border-violet-400 transition-all cursor-pointer group">
                  <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.819-.26.819-.578 0-.284-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.332-5.467-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="space-y-6">
              <h5 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Protocol</h5>
              <ul className="text-sm space-y-4 font-bold opacity-60">
                <li className="hover:text-violet-400 cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors">API Node Status</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors">Privacy Matrix</li>
                <li className="hover:text-violet-400 cursor-pointer transition-colors">System Changelog</li>
              </ul>
            </div>

            <div className="space-y-6 text-right md:text-left">
              <h5 className={`text-xs font-black uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Engine Health</h5>
              <div className="flex items-center space-x-3 justify-end md:justify-start">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-bold uppercase tracking-widest opacity-60">Uplink: Synchronized</span>
              </div>
              <div className="space-y-2 opacity-30">
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Regional Latency: 38ms</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Throughput: 1.2Gb/s</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">Uptime: 99.998%</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center text-[11px] tracking-[0.3em] uppercase font-black opacity-30 pt-12 border-t border-white/5">
            <p>© 2024 Project Intelligence Systems. All Brand DNA Reserved.</p>
            <div className="flex space-x-8 mt-6 md:mt-0">
               <span>Gemini Logic Core v4.2</span>
               <span>Cloudflare Edge Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
