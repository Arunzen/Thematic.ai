
import React from 'react';
import { WebsiteTheme } from '../types';

interface ThemeSpecsProps {
  theme: WebsiteTheme;
}

const ThemeSpecs: React.FC<ThemeSpecsProps> = ({ theme }) => {
  return (
    <div className="bg-slate-800/30 rounded-3xl border border-slate-700/50 p-8 backdrop-blur-sm transition-all hover:border-slate-600/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold font-heading tracking-tight">Brand Identity Token</h3>
        <div className="text-[10px] text-slate-500 font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">V1.0.0-STABLE</div>
      </div>
      
      <div className="space-y-8">
        {/* Colors */}
        <div>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-4">Master Color Palette</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Fixed error: explicitly cast entries to ensure name and hex are strings, avoiding 'unknown' type issues in strict TS */}
            {(Object.entries(theme.colors) as [string, string][]).map(([name, hex], idx) => (
              <div 
                key={name} 
                className="group relative flex items-center space-x-4 bg-slate-900/40 p-3 rounded-2xl border border-transparent hover:border-slate-700/50 transition-all hover:bg-slate-900/60 fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-lg transition-transform group-hover:scale-110 flex-shrink-0" 
                  style={{ backgroundColor: hex, boxShadow: `0 10px 15px -3px ${hex}33` }}
                ></div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-slate-500 font-black uppercase truncate">{name}</div>
                  <div className="text-xs font-mono text-slate-300 font-medium">{hex.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors fade-in-up stagger-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-3">Heading Typography</label>
            <div className="text-2xl font-bold tracking-tight" style={{ fontFamily: theme.typography.headingFont }}>{theme.typography.headingFont}</div>
            <div className="mt-2 text-[10px] text-slate-600 font-mono">Aa Bb Cc Dd Ee Ff 123</div>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/50 hover:border-slate-700/50 transition-colors fade-in-up stagger-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] block mb-3">Body Typography</label>
            <div className="text-2xl tracking-tight" style={{ fontFamily: theme.typography.bodyFont }}>{theme.typography.bodyFont}</div>
            <div className="mt-2 text-[10px] text-slate-600 font-mono">The quick brown fox jumps over the lazy dog.</div>
          </div>
        </div>

        {/* Aesthetic metadata */}
        <div className="bg-blue-600/5 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden group fade-in-up stagger-3">
           <div className="relative z-10">
             <h4 className="text-blue-400 font-bold text-sm mb-2 flex items-center space-x-2">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
               </svg>
               <span>Concept Manifest</span>
             </h4>
             <p className="text-sm text-slate-300 italic leading-relaxed">
               "Merging the foundational stability of {theme.industry} with the high-energy, narrative-driven aesthetic of {theme.aesthetic}. The result is a bold, future-facing interface designed for engagement."
             </p>
           </div>
           {/* Decorative flare */}
           <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSpecs;
