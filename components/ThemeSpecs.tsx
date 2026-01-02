
import React, { useState } from 'react';
import { WebsiteTheme } from '../types';

interface ThemeSpecsProps {
  theme: WebsiteTheme;
  isDarkMode: boolean;
}

const ThemeSpecs: React.FC<ThemeSpecsProps> = ({ theme, isDarkMode }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className={`rounded-3xl border p-8 backdrop-blur-xl transition-all hover:border-white/10 group ${isDarkMode ? 'bg-slate-800/20 border-white/5' : 'bg-white/80 border-slate-200'}`}>
      <div className="flex items-center justify-between mb-10">
        <div>
           <h3 className={`text-2xl font-black font-heading tracking-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Neural Specification</h3>
           <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Calculated Brand DNA</p>
        </div>
        <div className="text-[10px] text-violet-400 font-mono bg-violet-500/5 px-4 py-2 rounded-xl border border-violet-500/20 animate-pulse uppercase font-black">
           READY
        </div>
      </div>
      
      <div className="space-y-10">
        {/* Colors */}
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-6 ml-1">Color Substrate</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(Object.entries(theme.colors) as [string, string][]).map(([name, hex], idx) => (
              <button 
                key={name} 
                onClick={() => copyToClipboard(hex)}
                className={`group relative flex items-center space-x-4 p-3 rounded-2xl border transition-all text-left overflow-hidden active:scale-95 ${isDarkMode ? 'bg-slate-900/40 border-white/5 hover:border-white/20 hover:bg-slate-900/60' : 'bg-slate-100 border-slate-200 hover:border-slate-300 hover:bg-slate-200'}`}
              >
                <div 
                  className="w-12 h-12 rounded-xl shadow-lg transition-transform group-hover:scale-110 flex-shrink-0 relative overflow-hidden" 
                  style={{ backgroundColor: hex }}
                >
                  {copiedColor === hex && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter animate-in fade-in zoom-in">
                       COPIED
                    </div>
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className={`text-[10px] font-black uppercase truncate transition-colors ${isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-600'}`}>{name}</div>
                  <div className={`text-xs font-mono font-bold transition-colors ${isDarkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-800'}`}>{hex.toUpperCase()}</div>
                </div>
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-3xl border transition-all group/type ${isDarkMode ? 'bg-slate-900/40 border-white/5 hover:border-violet-500/20' : 'bg-slate-100 border-slate-200 hover:border-violet-500/20'}`}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4">Header Token</label>
            <div className={`text-3xl font-black tracking-tighter mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: theme.typography.headingFont }}>{theme.typography.headingFont}</div>
            <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Weight: Black • Subset: Latin</div>
          </div>
          <div className={`p-6 rounded-3xl border transition-all group/type ${isDarkMode ? 'bg-slate-900/40 border-white/5 hover:border-fuchsia-500/20' : 'bg-slate-100 border-slate-200 hover:border-fuchsia-500/20'}`}>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-4">Content Token</label>
            <div className={`text-3xl font-medium tracking-tight mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: theme.typography.bodyFont }}>{theme.typography.bodyFont}</div>
            <div className="text-[10px] text-slate-600 font-mono tracking-widest uppercase">Weight: Regular • Subset: UTF-8</div>
          </div>
        </div>

        {/* Logic manifest */}
        <div className={`border p-8 rounded-3xl relative overflow-hidden group/manifest ${isDarkMode ? 'bg-violet-600/5 border-violet-500/10' : 'bg-violet-500/5 border-violet-500/20'}`}>
           <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 group-hover/manifest:opacity-100 transition-opacity duration-700"></div>
           <div className="relative z-10 text-center">
             <h4 className="text-violet-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 flex items-center justify-center space-x-3">
               <span className="w-4 h-[1px] bg-violet-500/50"></span>
               <span>Inference Results</span>
               <span className="w-4 h-[1px] bg-violet-500/50"></span>
             </h4>
             <p className={`text-lg leading-relaxed font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
               "Engineered at the intersection of <span className="text-violet-400 font-bold">{theme.industry}</span> and <span className="text-fuchsia-400 font-bold">{theme.aesthetic}</span> logic. The interface prioritizes high-fidelity visual storytelling."
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSpecs;
