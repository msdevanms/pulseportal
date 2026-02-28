import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, RefreshCw, AlertCircle, Globe } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { LiveTicker } from './components/LiveTicker';
import { NewsGrid } from './components/NewsGrid';
import { LiveMap } from './components/LiveMap';
import { WordCloud } from './components/WordCloud';
import { fetchLivePulse } from './services/geminiService';
import { NewsItem, SearchState } from './types';

export default function App() {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [useFreeAccess, setUseFreeAccess] = useState(false);
  const [state, setState] = useState<SearchState>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for environments where aistudio is not defined
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleLogin = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true); // Proceed after opening dialog as per instructions
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    setState(prev => ({ ...prev, query, isLoading: true, error: null }));
    try {
      const newResults = await fetchLivePulse(query);
      setState(prev => {
        // Mark existing results as not new
        const oldResults = prev.results.map(r => ({ ...r, isNew: false }));
        
        // Deduplicate by ID and merge with existing results
        const existingIds = new Set(oldResults.map(r => r.id));
        const uniqueNewResults = newResults
          .filter(r => !existingIds.has(r.id))
          .map(r => ({ ...r, isNew: true }));
        
        // Prepend new results and keep only the latest 24 items
        const mergedResults = [...uniqueNewResults, ...oldResults].slice(0, 24);
        
        return {
          ...prev,
          results: mergedResults,
          isLoading: false
        };
      });
      setLastUpdated(new Date());
      setIsLive(true);
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Failed to fetch live updates. Please try again.' 
      }));
    }
  }, []);

  // Live update interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLive && state.query && !state.isLoading) {
      interval = setInterval(() => {
        handleSearch(state.query);
      }, 60000); // Update every 60 seconds
    }
    return () => clearInterval(interval);
  }, [isLive, state.query, state.isLoading, handleSearch]);

  if (hasKey === null) return null;

  if (!hasKey && !useFreeAccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass-card p-12 text-center"
        >
          <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-emerald-500/20">
            <Activity className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black text-zinc-100 mb-4 tracking-tight uppercase">
            Pulse<span className="text-emerald-500">Portal</span>
          </h1>
          <p className="text-zinc-400 mb-8 leading-relaxed">
            Welcome to the Intelligence Network. Connect a paid API key for high-quota access or continue with limited free access.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleLogin}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              Connect Paid API Key
            </button>
            
            <button
              onClick={() => setUseFreeAccess(true)}
              className="w-full py-4 bg-zinc-900 border border-white/10 hover:border-white/20 text-zinc-300 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continue with Free Access
            </button>
          </div>

          <p className="mt-8 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
            Secure Access • Global Intelligence
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-8 border-b border-white/5 bg-zinc-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
              <Activity className="w-6 h-6 text-zinc-950" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-zinc-100 uppercase">
                Pulse<span className="text-emerald-500">Portal</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">
                Real-time Intelligence Network
              </p>
            </div>
          </div>
          
          <div className="flex-1 max-w-xl w-full">
            <SearchBar onSearch={handleSearch} isLoading={state.isLoading} />
          </div>

          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="text-right hidden sm:block">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Last Update</p>
                <p className="text-xs text-zinc-300 font-mono">{lastUpdated.toLocaleTimeString()}</p>
              </div>
            )}
            <button 
              onClick={() => handleSearch(state.query)}
              disabled={!state.query || state.isLoading}
              className="p-3 rounded-full bg-zinc-900 border border-white/10 hover:border-emerald-500/50 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-emerald-400 ${state.isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {!state.query ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-[60vh] flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-8 border border-white/10">
                <Globe className="w-12 h-12 text-zinc-700" />
              </div>
              <h2 className="text-4xl font-black text-zinc-100 mb-4 tracking-tight">
                What's the world saying?
              </h2>
              <p className="text-zinc-500 max-w-md text-lg">
                Enter any topic, event, or brand to see a live pulse of news, social updates, and geographic impact.
              </p>
              <div className="mt-6 flex gap-4 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                <span>English</span>
                <span className="text-emerald-500/50">•</span>
                <span>മലയാളം</span>
                <span className="text-emerald-500/50">•</span>
                <span>हिन्दी</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {state.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                  <AlertCircle className="w-5 h-5" />
                  <p>{state.error}</p>
                </div>
              )}

              {state.results.length > 0 && (
                <>
                  <LiveTicker items={state.results} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <section className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-zinc-100">Geographic Impact</h3>
                        <span className="text-xs text-zinc-500 font-mono">{state.results.length} locations identified</span>
                      </div>
                      <LiveMap items={state.results} />
                    </section>
                    
                    <section className="h-full">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-zinc-100">Pulse Cloud</h3>
                      </div>
                      <WordCloud items={state.results} />
                    </section>
                  </div>

                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-zinc-100">Intelligence Feed</h3>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Live</span>
                      </div>
                    </div>
                    <NewsGrid items={state.results} />
                  </section>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50">
            <Activity className="w-5 h-5" />
            <span className="text-sm font-bold tracking-tighter uppercase">PulsePortal v1.0</span>
          </div>
          <div className="flex gap-8 text-xs font-mono text-zinc-600 uppercase tracking-widest">
            <span>Powered by Gemini AI</span>
            <span>Real-time Search</span>
            <span>Global Mapping</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
