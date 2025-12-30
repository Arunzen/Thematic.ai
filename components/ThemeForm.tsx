
import React, { useState } from 'react';

interface ThemeFormProps {
  onGenerate: (industry: string, aesthetic: string, businessName: string, subStyle: string, websiteUrl?: string) => void;
  isLoading: boolean;
}

const ThemeForm: React.FC<ThemeFormProps> = ({ onGenerate, isLoading }) => {
  const [industry, setIndustry] = useState('Fintech');
  const [aesthetic, setAesthetic] = useState('Midnight Neon');
  const [businessName, setBusinessName] = useState('Lumina Capital');
  const [subStyle, setSubStyle] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const stylePresets = [
    { label: 'Cartoon', value: 'Playful 3D Cartoon', color: 'bg-pink-500' },
    { label: 'Cyberpunk', value: 'Midnight Neon', color: 'bg-violet-600' },
    { label: 'Luxury', value: 'Minimalist Obsidian', color: 'bg-slate-700' },
    { label: 'Organic', value: 'Eco-Friendly Glassmorphism', color: 'bg-emerald-500' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(industry, aesthetic, businessName, subStyle, websiteUrl || undefined);
  };

  return (
    <div className="glass-card p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group border-white/5 hover:border-violet-500/20 transition-all duration-500">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-violet-600/10 blur-[60px] rounded-full group-hover:bg-violet-600/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-white font-heading tracking-tight flex items-center">
            <span className="w-10 h-10 rounded-xl bg-violet-600/20 flex items-center justify-center mr-4 border border-violet-500/30">
               <div className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-pulse"></div>
            </span>
            Directives
          </h2>
          <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Neural Input Phase</div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Business Identity</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:bg-slate-900/60 transition-all font-medium placeholder:text-slate-700"
                placeholder="Name of your venture..."
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Industry Sector</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Core Aesthetic</label>
                <input
                  type="text"
                  value={aesthetic}
                  onChange={(e) => setAesthetic(e.target.value)}
                  className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Quick Presets & Specific Character Box */}
            <div className="pt-1">
              <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 ml-1">Style Inspiration & Specificity</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {stylePresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAesthetic(preset.value)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${aesthetic === preset.value ? 'border-white/40 bg-white/10 text-white' : 'border-white/5 bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10'}`}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${preset.color}`}></span>
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* NEW: Specific Cartoon/Anime Input Box */}
              <div className="relative group/sub">
                <input
                  type="text"
                  value={subStyle}
                  onChange={(e) => setSubStyle(e.target.value)}
                  className="w-full bg-violet-500/5 border border-violet-500/20 rounded-2xl py-3 px-5 text-sm text-violet-200 focus:outline-none focus:ring-1 focus:ring-violet-400 focus:bg-violet-500/10 transition-all placeholder:text-violet-900/50"
                  placeholder="Enter specific Cartoon or Anime (e.g. Studio Ghibli, Naruto, SpongeBob)"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 group-focus-within/sub:opacity-100 transition-opacity">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1 flex items-center justify-between">
                <span>Reference URL (Optional)</span>
                <span className="text-emerald-400 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Crawl Ready</span>
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-medium placeholder:text-slate-800"
                placeholder="https://existing-site.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-6 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center space-x-4 
              ${isLoading ? 'bg-slate-800 cursor-not-allowed text-slate-600 border border-white/5' : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-600 animate-gradient text-white shadow-2xl shadow-violet-600/20 active:scale-[0.97]'}`}
          >
            {isLoading ? (
              <div className="flex items-center space-x-3">
                <svg className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" viewBox="0 0 24 24"></svg>
                <span>Synthesizing...</span>
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Generate Engine</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThemeForm;
