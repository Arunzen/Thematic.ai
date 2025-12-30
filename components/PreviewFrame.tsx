
import React, { useState } from 'react';
import { WebsiteTheme } from '../types';

interface PreviewFrameProps {
  theme: WebsiteTheme;
  heroImage: string | null;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ theme, heroImage }) => {
  const [activeTab, setActiveTab] = useState<keyof WebsiteTheme['pages']>('home');
  const currentPage = theme.pages[activeTab];

  return (
    <div 
      className="rounded-3xl border border-slate-700 overflow-hidden shadow-2xl flex flex-col transition-all duration-700 ease-in-out transform hover:shadow-blue-500/5"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.text }}
    >
      {/* Browser Bar */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 hover:scale-110 transition-transform"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 hover:scale-110 transition-transform"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 hover:scale-110 transition-transform"></div>
        </div>
        <div className="bg-slate-800 text-slate-400 text-[10px] md:text-xs py-1 px-4 md:px-8 rounded-full border border-slate-700 font-mono tracking-tight flex items-center space-x-2 opacity-60">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>https://{theme.businessName.toLowerCase().replace(/\s/g, '')}.ai</span>
        </div>
        <div className="w-8"></div>
      </div>

      {/* Internal Navigation */}
      <header className="px-6 md:px-10 py-5 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md" style={{ borderBottom: `1px solid ${theme.colors.accent}22` }}>
        <div className="text-2xl font-bold font-heading group cursor-default" style={{ color: theme.colors.primary }}>
          {theme.businessName}
        </div>
        <nav className="hidden md:flex space-x-8">
          {(Object.keys(theme.pages) as Array<keyof WebsiteTheme['pages']>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-sm font-medium capitalize transition-all relative py-1 ${activeTab === key ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              style={{ color: theme.colors.text }}
            >
              {key}
              {activeTab === key && (
                <span 
                  className="absolute bottom-0 left-0 w-full h-0.5 rounded-full" 
                  style={{ backgroundColor: theme.colors.primary }}
                ></span>
              )}
            </button>
          ))}
        </nav>
        <button 
          className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
        >
          Get Started
        </button>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto max-h-[600px] scroll-smooth">
        {/* Hero Section */}
        <div className="transition-opacity duration-300">
          <section className="relative h-[500px] flex items-center px-6 md:px-16 overflow-hidden">
            <div className="relative z-10 max-w-2xl fade-in-up">
              <h1 
                className="text-5xl md:text-7xl font-black mb-6 font-heading leading-tight tracking-tight" 
                style={{ color: theme.colors.primary }}
              >
                {currentPage.heroTitle}
              </h1>
              <p className="text-lg md:text-xl mb-10 opacity-80 leading-relaxed font-light">
                {currentPage.heroSubtitle}
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  className="px-8 py-4 rounded-xl font-bold shadow-xl transition-all hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-0"
                  style={{ backgroundColor: theme.colors.accent, color: theme.colors.background }}
                >
                  Explore Solution
                </button>
                <button 
                  className="px-8 py-4 rounded-xl font-bold border-2 transition-all hover:bg-white/5 active:scale-95"
                  style={{ borderColor: theme.colors.primary, color: theme.colors.primary }}
                >
                  Contact Us
                </button>
              </div>
            </div>

            {/* AI Generated Background */}
            <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${heroImage ? 'opacity-100' : 'opacity-0'}`}>
              {heroImage && (
                <>
                  <img src={heroImage} alt="Hero" className="w-full h-full object-cover grayscale-[0.3] brightness-[0.4]" />
                  <div 
                    className="absolute inset-0" 
                    style={{ background: `linear-gradient(90deg, ${theme.colors.background} 20%, transparent 100%)` }}
                  ></div>
                </>
              )}
            </div>
            {!heroImage && (
              <div className="absolute inset-0 bg-gradient-to-br opacity-20" style={{ backgroundImage: `linear-gradient(to bottom right, ${theme.colors.primary}, ${theme.colors.secondary})` }}></div>
            )}
          </section>

          {/* Dynamic Sections */}
          <section className="px-6 md:px-16 py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPage.sections.map((section, idx) => (
                <div 
                  key={idx}
                  className="p-10 rounded-3xl border transition-all duration-500 hover:translate-y-[-8px] group hover:shadow-2xl"
                  style={{ 
                    backgroundColor: theme.colors.card, 
                    borderColor: `${theme.colors.accent}11` 
                  }}
                >
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg"
                    style={{ backgroundColor: `${theme.colors.primary}11` }}
                  >
                    <span className="text-3xl filter saturate-150">{section.icon || '✨'}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 font-heading" style={{ color: theme.colors.primary }}>
                    {section.heading}
                  </h3>
                  <p className="opacity-70 leading-relaxed text-base font-light">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Aesthetic Specific CTA Section */}
          <section className="py-24 px-6 text-center relative overflow-hidden" style={{ backgroundColor: `${theme.colors.secondary}08` }}>
              <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-4xl font-bold mb-6 font-heading tracking-tight">The {theme.aesthetic} Advantage</h2>
                <p className="text-lg opacity-70 mb-10 leading-relaxed">
                    Experience {theme.industry} like never before with our uniquely themed interface and powerful back-end logic. We redefine expectations through the lens of {theme.aesthetic}.
                </p>
                <button 
                   className="px-10 py-4 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-xl"
                   style={{ backgroundColor: theme.colors.primary, color: theme.colors.background }}
                >
                  Join the Evolution
                </button>
              </div>
              {/* Background accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 blur-[100px] pointer-events-none" style={{ background: `radial-gradient(circle, ${theme.colors.accent}, transparent)` }}></div>
          </section>
        </div>
      </main>

      <footer className="py-12 px-10 border-t" style={{ borderColor: `${theme.colors.accent}11`, backgroundColor: `${theme.colors.background}` }}>
        <div className="flex flex-col md:flex-row justify-between items-center opacity-50 text-xs tracking-widest uppercase font-semibold">
          <p>© 2024 {theme.businessName} • {theme.industry} Solutions</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-white cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PreviewFrame;
