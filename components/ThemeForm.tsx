
import React, { useState, useEffect } from 'react';
import { getRemainingCredits } from '../services/secure/limiter';

interface ThemeFormProps {
  onGenerate: (industry: string, aesthetic: string, businessName: string, subStyle: string, palettePref: string, websiteUrl?: string) => void;
  isLoading: boolean;
  isDarkMode: boolean;
}

const ThemeForm: React.FC<ThemeFormProps> = ({ onGenerate, isLoading, isDarkMode }) => {
  const [industry, setIndustry] = useState('Fintech');
  const [aesthetic, setAesthetic] = useState('Luxury Minimalist');
  const [businessName, setBusinessName] = useState('Pearl Capital');
  const [subStyle, setSubStyle] = useState('');
  const [palettePref, setPalettePref] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [credits, setCredits] = useState(getRemainingCredits());

  useEffect(() => {
    if (!isLoading) {
      setCredits(getRemainingCredits());
    }
  }, [isLoading]);

  const stylePresets = [
    { label: 'Pastel', value: 'Soft Dreamscape', palette: 'Pink and Lavender', color: 'bg-[#FFCACC]' },
    { label: 'Cyber', value: 'Neo Quartz', palette: 'Lavender and Dark Slate', color: 'bg-[#DBC4F0]' },
    { label: 'Nature', value: 'Verdant Minimal', palette: 'Sage and Cream', color: 'bg-[#D4E2D4]' },
    { label: 'Clean', value: 'High Contrast Neutral', palette: 'Off-white and Navy', color: 'bg-[#FAF3F0]' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credits > 0) {
      onGenerate(industry, aesthetic, businessName, subStyle, palettePref, websiteUrl || undefined);
    }
  };

  const isExhausted = credits <= 0;

  return (
    <div className={`glass-card p-8 md:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group transition-all duration-500 border-white/5 hover:border-violet-500/20`}>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full group-hover:bg-violet-600/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-2xl font-black font-heading tracking-tight flex items-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 border transition-colors ${isExhausted ? 'bg-red-500/20 border-red-500/30' : 'bg-violet-600/20 border-violet-500/30'}`}>
               <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isExhausted ? 'bg-red-400' : 'bg-violet-400'}`}></div>
            </span>
            Directives
          </h2>
          <div className="flex flex-col items-end">
            <div className={`text-[9px] font-bold px-2 py-0.5 rounded border ${isExhausted ? 'text-red-400 border-red-500/30 bg-red-500/5' : 'text-violet-400 border-violet-500/30 bg-violet-500/5'}`}>
              Budget: {credits}/4
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Business Identity</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Pearl Capital"
                className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium placeholder:text-slate-700 ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Industry</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Technology"
                  className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Core Aesthetic</label>
                <input
                  type="text"
                  value={aesthetic}
                  onChange={(e) => setAesthetic(e.target.value)}
                  placeholder="e.g. Luxury Minimalist"
                  className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Color Palette / Theme Reference</label>
              <input
                type="text"
                value={palettePref}
                onChange={(e) => setPalettePref(e.target.value)}
                placeholder="e.g. Pearl Pink, Lavender Frost, Sage Green"
                className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium placeholder:text-slate-700 ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Reference Website (Optional)</label>
              <div className="relative">
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium placeholder:text-slate-700 pr-12 ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 9.172a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102 1.101" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Creative Motif / Sub-Style</label>
              <textarea
                value={subStyle}
                onChange={(e) => setSubStyle(e.target.value)}
                placeholder="Describe specific preferences (e.g. Soft pastels, quartz textures, minimal organic shapes...)"
                rows={2}
                className={`w-full border rounded-2xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium placeholder:text-slate-700 resize-none ${isDarkMode ? 'bg-black/40 border-white/5 text-white' : 'bg-white/60 border-slate-200 text-slate-900'}`}
              />
            </div>

            <div>
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 ml-1">Inference Presets</label>
              <div className="flex flex-wrap gap-2">
                {stylePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                        setAesthetic(preset.value);
                        setPalettePref(preset.palette);
                        setSubStyle(`Focusing on the ${preset.label} visual language.`);
                    }}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${aesthetic === preset.value ? 'border-violet-500/40 bg-violet-500/10 text-violet-200' : 'border-white/5 bg-white/5 text-slate-500 hover:text-slate-300'}`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${preset.color}`}></span>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isExhausted}
            className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center space-x-4 
              ${isLoading ? 'bg-slate-800 cursor-not-allowed text-slate-600' : 
                isExhausted ? 'bg-red-500/10 text-red-400/50 border border-red-500/20 cursor-not-allowed' :
                'bg-gradient-to-r from-[#DBC4F0] via-[#FFCACC] to-[#FAF3F0] animate-gradient text-slate-900 shadow-2xl shadow-violet-600/20 active:scale-[0.97]'}`}
          >
            {isLoading ? <span>Synthesizing...</span> : isExhausted ? <span>Limit Reached</span> : <span>Generate Engine</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThemeForm;
