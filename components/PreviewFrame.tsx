
import React, { useState, useMemo } from 'react';
import { WebsiteTheme } from '../types';

interface PreviewFrameProps {
  theme: WebsiteTheme;
  heroImage: string | null;
  logoUrl: string | null;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ theme, heroImage, logoUrl }) => {
  const [activeTab, setActiveTab] = useState<keyof WebsiteTheme['pages']>('home');
  const [isPreviewDarkMode, setIsPreviewDarkMode] = useState(true);
  const currentPage = theme.pages[activeTab];

  // Deep theme application:
  // Night Mode: Original generated palette.
  // Light Mode: A structured adaptation that preserves primary/accent for branding but swaps base background.
  const previewColors = useMemo(() => {
    if (isPreviewDarkMode) {
      return theme.colors;
    }
    // Sophisticated Light Mode mapping
    return {
      ...theme.colors,
      background: '#FFFFFF',
      text: '#121212',
      card: '#F8F9FA',
      accent: theme.colors.primary, 
      secondary: theme.colors.secondary,
    };
  }, [theme.colors, isPreviewDarkMode]);

  const headingStyle = { fontFamily: theme.typography.headingFont || 'Plus Jakarta Sans, sans-serif' };
  const bodyStyle = { fontFamily: theme.typography.bodyFont || 'Inter, sans-serif' };

  // Page specific content renderings to make each tab feel like a real site
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center px-6 md:px-24 overflow-hidden">
              <div className="relative z-10 max-w-4xl">
                <div 
                  className="inline-flex items-center space-x-3 px-4 py-2 rounded-full mb-8 backdrop-blur-md border"
                  style={{ backgroundColor: `${previewColors.primary}10`, borderColor: `${previewColors.primary}20` }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: previewColors.primary }}></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: previewColors.primary }}>New Experience Live</span>
                </div>
                <h1 
                  className="text-6xl md:text-9xl font-black mb-10 leading-[0.95] tracking-tighter" 
                  style={{ color: previewColors.primary, ...headingStyle }}
                >
                  {currentPage.heroTitle}
                </h1>
                <p className="text-xl md:text-2xl mb-14 opacity-80 leading-relaxed font-medium max-w-2xl">
                  {currentPage.heroSubtitle}
                </p>
                <div className="flex items-center space-x-6">
                  <button 
                    className="px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: previewColors.primary, color: isPreviewDarkMode ? '#000' : '#FFF' }}
                  >
                    Get Started
                  </button>
                  <button 
                    className="px-12 py-6 rounded-2xl text-xs font-black uppercase tracking-[0.3em] border transition-all hover:bg-white/5"
                    style={{ borderColor: `${previewColors.text}30`, color: previewColors.text }}
                  >
                    Learn More
                  </button>
                </div>
              </div>

              {/* Background Layer */}
              <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out ${heroImage ? 'opacity-100 scale-100' : 'opacity-10 scale-110'}`}>
                {heroImage ? (
                  <img 
                    src={heroImage} 
                    alt="Brand Hero" 
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      isPreviewDarkMode ? 'brightness-[0.4] grayscale-[0.2]' : 'brightness-[1.0] grayscale-0'
                    }`} 
                  />
                ) : (
                  <div 
                    className="w-full h-full animate-pulse"
                    style={{ background: `linear-gradient(135deg, ${previewColors.primary}20, transparent)` }}
                  ></div>
                )}
                <div 
                  className="absolute inset-0" 
                  style={{ 
                    background: `linear-gradient(90deg, ${previewColors.background} 30%, transparent 100%)` 
                  }}
                ></div>
              </div>
            </section>

            {/* Home Specific Features */}
            <section className="px-6 md:px-24 py-40">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {currentPage.sections.map((section, idx) => (
                  <div 
                    key={idx}
                    className="p-14 rounded-[4rem] border transition-all duration-500 hover:translate-y-[-10px] group/card shadow-sm hover:shadow-2xl"
                    style={{ 
                      backgroundColor: previewColors.card, 
                      borderColor: `${previewColors.accent}20` 
                    }}
                  >
                    <div 
                      className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-10 transition-transform group-hover/card:rotate-12 duration-500 shadow-lg" 
                      style={{ backgroundColor: `${previewColors.primary}20` }}
                    >
                      <span className="text-4xl">{section.icon || '✨'}</span>
                    </div>
                    <h3 
                      className="text-3xl font-black mb-6 tracking-tight" 
                      style={{ color: previewColors.primary, ...headingStyle }}
                    >
                      {section.heading}
                    </h3>
                    <p className="opacity-70 leading-relaxed font-medium text-lg">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        );
      case 'about':
        return (
          <section className="px-6 md:px-24 py-40 max-w-5xl mx-auto">
            <h2 className="text-5xl font-black mb-12" style={{ color: previewColors.primary, ...headingStyle }}>{currentPage.heroTitle}</h2>
            <div className="space-y-12">
               <p className="text-3xl leading-snug font-medium opacity-90">{currentPage.heroSubtitle}</p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-12">
                 {currentPage.sections.map((s, i) => (
                   <div key={i} className="p-10 rounded-3xl border-l-4" style={{ backgroundColor: `${previewColors.card}`, borderLeftColor: previewColors.primary }}>
                     <h4 className="text-xl font-black mb-4" style={{ color: previewColors.primary }}>{s.heading}</h4>
                     <p className="opacity-70">{s.content}</p>
                   </div>
                 ))}
               </div>
            </div>
          </section>
        );
      case 'services':
        return (
          <section className="px-6 md:px-24 py-40">
             <div className="text-center mb-24">
                <h2 className="text-5xl font-black mb-6" style={{ color: previewColors.primary, ...headingStyle }}>Services & Expertise</h2>
                <p className="max-w-2xl mx-auto opacity-70">{currentPage.heroSubtitle}</p>
             </div>
             <div className="space-y-6">
                {currentPage.sections.map((s, i) => (
                  <div key={i} className="flex flex-col md:flex-row items-center p-12 rounded-[3rem] border transition-all hover:bg-white/5" style={{ borderColor: `${previewColors.accent}15` }}>
                    <div className="text-6xl mb-6 md:mb-0 md:mr-12 opacity-40">{i + 1 < 10 ? `0${i+1}` : i+1}</div>
                    <div className="flex-1">
                       <h3 className="text-2xl font-black mb-2" style={{ color: previewColors.primary }}>{s.heading}</h3>
                       <p className="opacity-70 leading-relaxed">{s.content}</p>
                    </div>
                    <button className="mt-6 md:mt-0 px-8 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest" style={{ borderColor: `${previewColors.primary}40`, color: previewColors.primary }}>Enquire</button>
                  </div>
                ))}
             </div>
          </section>
        );
      case 'contact':
        return (
          <section className="px-6 md:px-24 py-40 max-w-4xl mx-auto">
             <div className="glass-card p-16 rounded-[4rem] border" style={{ backgroundColor: previewColors.card, borderColor: `${previewColors.primary}20` }}>
                <h2 className="text-4xl font-black mb-10" style={{ color: previewColors.primary, ...headingStyle }}>Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Full Name</label>
                      <input type="text" className="w-full bg-transparent border-b py-3 focus:outline-none" style={{ borderColor: `${previewColors.text}20` }} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Email Address</label>
                      <input type="email" className="w-full bg-transparent border-b py-3 focus:outline-none" style={{ borderColor: `${previewColors.text}20` }} />
                   </div>
                </div>
                <div className="space-y-2 mb-12">
                    <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Message Protocol</label>
                    <textarea className="w-full bg-transparent border-b py-3 focus:outline-none resize-none" rows={3} style={{ borderColor: `${previewColors.text}20` }}></textarea>
                </div>
                <button className="w-full py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl" style={{ backgroundColor: previewColors.primary, color: isPreviewDarkMode ? '#000' : '#FFF' }}>Send Message</button>
             </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="overflow-hidden flex flex-col transition-all duration-700 ease-in-out min-h-[800px]"
      style={{ 
        backgroundColor: previewColors.background, 
        color: previewColors.text,
        ...bodyStyle 
      }}
    >
      {/* Simulation Frame Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between z-20">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Neural Preview:</span>
            <button 
              onClick={() => setIsPreviewDarkMode(!isPreviewDarkMode)}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 border focus:outline-none ${
                isPreviewDarkMode ? 'bg-violet-600/20 border-violet-500/50' : 'bg-slate-200 border-slate-300'
              }`}
              aria-label="Toggle Night Mode"
            >
              <div className={`absolute top-1 w-3.5 h-3.5 rounded-full transition-all duration-500 flex items-center justify-center ${
                isPreviewDarkMode ? 'left-7 bg-violet-400' : 'left-1 bg-slate-500'
              }`}>
                 <span className="text-[6px]">{isPreviewDarkMode ? '🌙' : '☀️'}</span>
              </div>
            </button>
          </div>
          <div className="h-4 w-[1px] bg-slate-700"></div>
          <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isPreviewDarkMode ? 'text-violet-400' : 'text-slate-400'}`}>
            {isPreviewDarkMode ? 'Dark Manifest' : 'Light Manifest'}
          </span>
        </div>
      </div>

      {/* Brand Navigation */}
      <header 
        className="px-6 md:px-24 py-10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-xl" 
        style={{ borderBottom: `1px solid ${previewColors.accent}15` }}
      >
        <div className="flex items-center space-x-5 group cursor-pointer" onClick={() => setActiveTab('home')}>
          {logoUrl ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden border shadow-lg group-hover:scale-110 transition-transform duration-500" style={{ borderColor: `${previewColors.primary}30` }}>
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-dashed opacity-20" style={{ borderColor: previewColors.primary }}>
               <span className="text-xl">∞</span>
            </div>
          )}
          <div className="text-4xl font-black tracking-tighter" style={{ color: previewColors.primary, ...headingStyle }}>
            {theme.businessName}
          </div>
        </div>
        <nav className="hidden lg:flex space-x-14">
          {(Object.keys(theme.pages) as Array<keyof WebsiteTheme['pages']>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-[11px] font-black uppercase tracking-[0.4em] transition-all relative py-2 group ${activeTab === key ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              style={{ color: previewColors.text }}
            >
              {key}
              <span 
                className={`absolute bottom-0 left-0 h-0.5 transition-all duration-700 ${activeTab === key ? 'w-full' : 'w-0 group-hover:w-full'}`}
                style={{ backgroundColor: previewColors.primary }}
              ></span>
            </button>
          ))}
        </nav>
      </header>

      {/* Themed Main Area */}
      <main className="flex-1 overflow-y-auto max-h-[700px] scroll-smooth">
        {renderContent()}

        {/* Themed Footer */}
        <footer 
          className="py-32 px-6 md:px-24 border-t flex flex-col md:flex-row justify-between items-start"
          style={{ borderColor: `${previewColors.accent}15`, backgroundColor: `${previewColors.primary}05` }}
        >
          <div className="mb-12 md:mb-0">
             <div className="text-3xl font-black tracking-tighter mb-4" style={{ color: previewColors.primary, ...headingStyle }}>{theme.businessName}</div>
             <p className="max-w-xs opacity-50 text-sm leading-relaxed font-medium">Crafting premium digital experiences at the frontier of {theme.industry} innovation.</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
             <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40">Portal</h5>
                <ul className="text-xs space-y-3 font-bold">
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">About Us</li>
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">Solutions</li>
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">Intelligence</li>
                </ul>
             </div>
             <div className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest opacity-40">Connect</h5>
                <ul className="text-xs space-y-3 font-bold">
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">Twitter</li>
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">Instagram</li>
                   <li className="hover:opacity-100 opacity-60 cursor-pointer">LinkedIn</li>
                </ul>
             </div>
          </div>
        </footer>
        <div className="py-10 text-center opacity-20 text-[9px] font-black uppercase tracking-[0.5em]">
          © 2024 {theme.businessName} • Digital Identity Manifested by Thematic.ai
        </div>
      </main>
    </div>
  );
};

export default PreviewFrame;
