
import React, { useState, useEffect, useCallback } from 'react';
import ThemeForm from './components/ThemeForm';
import PreviewFrame from './components/PreviewFrame';
import ThemeSpecs from './components/ThemeSpecs';
import { generateThemeStructure, generateHeroImage } from './services/geminiService';
import { GeneratedThemeState, WebsiteTheme } from './types';

const App: React.FC = () => {
  const [themeState, setThemeState] = useState<GeneratedThemeState>({
    data: null,
    heroImageUrl: null,
    loading: false,
    error: null,
  });

  const [loadingStep, setLoadingStep] = useState(0);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [appCopyFeedback, setAppCopyFeedback] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  const steps = [
    "Analyzing brand semantics...",
    "Reimagining visual hierarchy...",
    "Synthesizing creative motifs...",
    "Generating neural visual assets...",
    "Injecting character DNA..."
  ];

  const handleGenerate = useCallback(async (industry: string, aesthetic: string, businessName: string, subStyle: string, websiteUrl?: string) => {
    setThemeState(prev => ({ ...prev, loading: true, error: null, data: null, heroImageUrl: null }));
    try {
      const structure = await generateThemeStructure(industry, aesthetic, businessName, subStyle, websiteUrl);
      setThemeState(prev => ({ ...prev, data: structure }));
      
      try {
        const imageUrl = await generateHeroImage(structure);
        setThemeState(prev => ({ ...prev, heroImageUrl: imageUrl, loading: false }));
      } catch (imageErr) {
        console.error("Failed to generate image:", imageErr);
        setThemeState(prev => ({ ...prev, loading: false }));
      }
    } catch (err: any) {
      setThemeState({
        data: null,
        heroImageUrl: null,
        loading: false,
        error: err.message || "Engine failure detected.",
      });
    }
  }, []);

  // Handle URL Parameters for Sharing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    const ind = params.get('ind');
    const aes = params.get('aes');
    const style = params.get('style');
    const url = params.get('url');

    if (name && ind && aes) {
      setIsSharedView(true);
      handleGenerate(ind, aes, name, style || '', url || undefined);
    }
  }, [handleGenerate]);

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

  const handleExport = () => {
    if (!themeState.data) return;
    const blob = new Blob([JSON.stringify(themeState.data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thematic-${themeState.data.businessName.toLowerCase().replace(/\s/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareProject = () => {
    if (!themeState.data) return;
    const baseUrl = window.location.origin + window.location.pathname;
    const params = new URLSearchParams({
      name: themeState.data.businessName,
      ind: themeState.data.industry,
      aes: themeState.data.aesthetic,
      style: themeState.data.aesthetic,
      url: ''
    });
    const shareLink = `${baseUrl}?${params.toString()}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    });
  };

  const handleShareApp = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    navigator.clipboard.writeText(baseUrl).then(() => {
      setAppCopyFeedback(true);
      setTimeout(() => setAppCopyFeedback(false), 3000);
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-violet-500/30 overflow-x-hidden">
      <header className="px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 z-50 bg-[#020617]/80 backdrop-blur-2xl">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.location.href = window.location.origin + window.location.pathname}>
          <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-rose-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-violet-500/20 group-hover:rotate-6 transition-all duration-500 relative">
            {isSharedView && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#020617] animate-pulse"></div>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 114 0v1a2 2 0 01-2 2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black font-heading tracking-tight leading-none flex items-center">
              Thematic<span className="text-violet-500">.ai</span>
              {isSharedView && (
                <span className="ml-3 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">Perspective Synced</span>
              )}
            </h1>
            <span className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mt-1">Intelligence Layer</span>
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          <button 
            onClick={handleShareApp}
            className={`px-6 py-3 rounded-2xl border transition-all active:scale-95 flex items-center space-x-2 
              ${appCopyFeedback ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{appCopyFeedback ? 'Link Copied' : 'Share App'}</span>
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/10 transition-all active:scale-95">
            License Portal
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative z-10">
          <div className="lg:col-span-4 space-y-10 fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-[10px] font-black uppercase tracking-widest">
                Deep Linking Enabled
              </div>
              <h2 className="text-5xl lg:text-6xl font-black font-heading text-white leading-[1.1] tracking-tight">
                Design at the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-rose-400 animate-gradient">Speed of Thought.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                Our neural architecture parses your brand directives to engineer bespoke digital identities in seconds.
              </p>
            </div>
            <ThemeForm onGenerate={handleGenerate} isLoading={themeState.loading} />
            {themeState.error && (
              <div className="p-5 bg-red-500/5 border border-red-500/20 rounded-3xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span>Error: {themeState.error}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-8">
            {!themeState.data && !themeState.loading ? (
              <div className="h-full min-h-[600px] glass-card rounded-[3rem] border border-white/5 flex flex-col items-center justify-center text-slate-600 p-16 text-center group hover:border-violet-500/20 transition-all duration-1000">
                <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:rotate-12 transition-all duration-700 shadow-2xl relative">
                   <div className="absolute inset-0 bg-violet-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 opacity-20 group-hover:opacity-100 group-hover:text-violet-500 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.503 1.51a2 2 0 01-2.098 1.414l-1.51-.503a2 2 0 00-1.414 1.96l.477 2.387a2 2 0 00.547 1.022M19.428 15.428l1.022-.547a2 2 0 00.547-1.022l.477-2.387a2 2 0 00-1.96-1.414l-1.51.503a2 2 0 01-1.414-1.96l.503-1.51a2 2 0 00-1.414-1.96l-2.387-.477a2 2 0 00-1.022.547l-1.022.547a2 2 0 00-.547 1.022l-.477 2.387a2 2 0 001.96 1.414l1.51-.503a2 2 0 011.414 1.96l-.503 1.51a2 2 0 001.414 1.96l2.387.477a2 2 0 001.022-.547l1.022-.547z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black text-slate-300 mb-4 font-heading">Neural Workspace Idle</h3>
                <p className="max-w-md text-slate-500 text-lg leading-relaxed">Provide brand parameters or a reference URL to initialize the thematic generation sequence.</p>
              </div>
            ) : (
              <div className="space-y-10 fade-in-up">
                {themeState.data && (
                  <>
                    <div className="flex items-center justify-between flex-wrap gap-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
                           <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse"></div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-black font-heading text-white">Generation Manifest</h3>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{themeState.data.industry} • {themeState.data.aesthetic}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button 
                          onClick={handleShareProject}
                          className={`px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border flex items-center space-x-3 
                            ${copyFeedback ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                          <span>{copyFeedback ? 'Project Link Copied' : 'Share Project'}</span>
                        </button>
                        <button 
                          onClick={handleExport}
                          className="bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center space-x-3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          <span>System Export</span>
                        </button>
                      </div>
                    </div>
                    <PreviewFrame theme={themeState.data} heroImage={themeState.heroImageUrl} />
                    <div className="fade-in-up stagger-2">
                      <ThemeSpecs theme={themeState.data} />
                    </div>
                  </>
                )}
                {themeState.loading && (
                   <div className="h-full min-h-[600px] glass-card rounded-[3rem] flex flex-col items-center justify-center space-y-10 fade-in-up relative overflow-hidden">
                      <div className="absolute inset-0 scan-line pointer-events-none opacity-20"></div>
                      <div className="relative">
                        <div className="w-40 h-40 border-4 border-violet-500/5 rounded-[2.5rem] animate-pulse"></div>
                        <div className="absolute inset-0 w-40 h-40 border-t-4 border-violet-500 rounded-[2.5rem] animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 bg-violet-500 rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <div className="text-center relative z-10 px-8">
                        <h4 className="text-3xl font-black text-white mb-4 font-heading tracking-tight">
                          {steps[loadingStep]}
                        </h4>
                        <p className="text-slate-500 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                          Our neural clusters are interpreting your brand's unique signature and encoding the visual landscape...
                        </p>
                      </div>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-violet-600/5 blur-[100px] rounded-full animate-float"></div>
        <div className="absolute top-1/2 -right-40 w-60 h-60 bg-rose-600/5 blur-[80px] rounded-full"></div>
      </main>

      <footer className="py-20 px-10 border-t border-white/5 bg-[#020617] mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center opacity-30">
          <div className="flex items-center space-x-3 mb-8 md:mb-0">
            <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
            <span className="text-sm font-black tracking-widest uppercase">Thematic System v3.4.0</span>
          </div>
          <div className="flex space-x-12 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="hover:text-white cursor-pointer transition-colors" onClick={handleShareApp}>Get App Link</span>
            <span className="hover:text-white cursor-pointer transition-colors">Neural Docs</span>
            <span className="hover:text-white cursor-pointer transition-colors">Safety Protocols</span>
            <span className="hover:text-white cursor-pointer transition-colors">API Access</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
