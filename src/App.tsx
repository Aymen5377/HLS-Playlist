import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Trash2, 
  Save, 
  Share2, 
  Maximize2, 
  Minimize2, 
  Smartphone, 
  Code2,
  Terminal,
  Zap,
  Loader2,
  AlertCircle
} from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { dart } from '@codemirror/legacy-modes/mode/clike';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from "@google/genai";

/**
 * Utility for tailwind class merging
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Model Configuration
const getAI = () => {
  const envKey = process.env.GEMINI_API_KEY;
  // Use env key if valid and not a placeholder, otherwise use user provided key
  const apiKey = (envKey && envKey !== "MY_GEMINI_API_KEY" && !envKey.includes("MY_APP_URL")) 
    ? envKey 
    : "AIzaSyATfelqFXPaML_zCmVUeb0CiDXvnzc0kh0";
  
  return new GoogleGenAI({ apiKey });
};

// Initial Flutter Code
const DEFAULT_CODE = `import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      theme: ThemeData.dark().copyWith(
        scaffoldBackgroundColor: const Color(0xFF050505),
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFFD000FF),
          brightness: Brightness.dark,
        ),
      ),
      home: Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.bolt, size: 80, color: Color(0xFFD000FF)),
              const SizedBox(height: 20),
              const Text(
                'FLUTTER FORGE',
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const Text('Cyber-Luxury Edition'),
              const SizedBox(height: 40),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD000FF),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                ),
                child: const Text('EXPLORE ASSETS'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`;

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [renderedPreview, setRenderedPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const compileCode = async () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const ai = getAI();
      const prompt = `
        You are a Flutter-to-Web renderer. Given the following Flutter Dart code, generate a single-file Tailwind HTML snippet that visually mimics the UI described in the code.
        
        Rules:
        1. Only return the HTML content wrapped in a single container div. 
        2. Use Tailwind CSS classes for all styling.
        3. Match the colors, padding, alignment, and fonts accurately. Use custom hex values for colors.
        4. If icons are used, use simple emoji or SVG icons.
        5. The container should fill its parent (w-full h-full).
        6. DO NOT return any text other than the HTML snippet. No markdown code blocks.
        
        Flutter Code:
        ${code}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }]
      });

      const text = response.text || "";
      
      // Clean up accidental markdown
      const cleaned = text.replace(/```jsx/gi, '').replace(/```html/gi, '').replace(/```/gi, '').trim();
      
      if (!cleaned) {
        throw new Error("Model returned an empty response.");
      }

      setRenderedPreview(cleaned);
      // Switch view to preview after successful run
      setViewMode('preview');
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("API key not valid")) {
        setError("Invalid API Key: The GEMINI_API_KEY in your Secrets is not valid. Please double-check it in AI Studio.");
      } else {
        setError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Removed auto-compile on mount to honor user request
  useEffect(() => {
    // compileCode();
  }, []);

  const handleClear = () => {
    if (window.confirm('Clear all code?')) {
      setCode('');
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
    localStorage.setItem('flutter_forge_snippet', code);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied!');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-obsidian font-sans text-white">
      {/* Navigation */}
      <nav className="glass h-16 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-neon-purple rounded-xl flex items-center justify-center neon-glow">
            <Zap className="text-white w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="font-bold tracking-widest text-lg neon-text-glow">FLUTTER FORGE</h1>
            <p className="text-[10px] text-white/40 tracking-[0.2em] -mt-1 uppercase">Cyber-Luxury Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/10 hidden md:flex">
          {(['editor', 'preview'] as const).map((mode) => (
            <button 
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-8 py-1.5 rounded-full text-[10px] tracking-widest uppercase transition-all duration-300",
                viewMode === mode ? "bg-neon-purple text-white shadow-[0_0_20px_rgba(208,0,255,0.4)]" : "text-white/40 hover:text-white"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleShare} className="p-2 text-white/40 hover:text-neon-purple transition-colors">
            <Share2 size={18} />
          </button>
          <button onClick={handleSave} className="p-2 text-white/40 hover:text-neon-purple transition-colors">
            {isSaving ? <Loader2 size={18} className="animate-spin text-neon-purple" /> : <Save size={18} />}
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Editor Area */}
        <AnimatePresence mode="popLayout">
          {(viewMode === 'split' || viewMode === 'editor') && (
            <motion.section 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className={cn(
                "flex flex-col border-r border-white/5 h-full",
                viewMode === 'editor' ? "w-full" : "w-1/2"
              )}
            >
              <div className="h-10 bg-white/5 flex items-center px-4 justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-neon-purple" />
                  <span className="text-[9px] tracking-widest text-white/40 uppercase font-mono">main.dart</span>
                </div>
              </div>
              <div className="flex-1 bg-[#050505]">
                <CodeMirror
                  value={code}
                  height="100%"
                  theme={vscodeDark}
                  extensions={[StreamLanguage.define(dart)]} 
                  onChange={(val) => setCode(val)}
                  className="hide-scrollbar"
                />
              </div>
              <div className="h-12 bg-white/5 px-4 flex items-center justify-between">
                <button onClick={handleClear} className="text-[10px] text-white/20 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2">
                  <Trash2 size={12} /> Clear
                </button>
                <button 
                  onClick={compileCode}
                  disabled={isLoading}
                  className="bg-neon-purple/20 hover:bg-neon-purple text-neon-purple hover:text-white px-6 py-1.5 rounded-full border border-neon-purple/40 transition-all text-[10px] font-bold tracking-widest flex items-center gap-2"
                >
                  {isLoading ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} className="fill-current" />}
                  COMPILE & RUN
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Live Canvas Area */}
        <AnimatePresence mode="popLayout">
          {(viewMode === 'split' || viewMode === 'preview') && (
            <motion.section 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className={cn(
                "flex flex-col h-full bg-[#080808]",
                viewMode === 'preview' ? "w-full" : "w-1/2"
              )}
            >
              <div className="h-10 bg-white/5 flex items-center px-4 justify-between border-b border-white/5">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setViewMode('editor')}
                    className="flex items-center gap-2 text-[10px] text-white/40 hover:text-white uppercase tracking-widest transition-colors bg-white/5 px-3 py-1 rounded-md"
                  >
                    <Code2 size={12} /> Back to Code
                  </button>
                  <div className="flex items-center gap-2 text-neon-purple border-l border-white/10 pl-4">
                    <Smartphone size={14} />
                    <span className="text-[9px] tracking-widest uppercase">Live Simulation</span>
                  </div>
                </div>
                <button onClick={() => setIsFullscreen(!isFullscreen)} className="text-white/20 hover:text-white transition-colors">
                  <Maximize2 size={14} />
                </button>
              </div>
              
              <div className="flex-1 flex items-center justify-center p-8 bg-black">
                 {/* Device Shell */}
                 <div className="w-[300px] h-[600px] rounded-[3rem] border-[12px] border-[#1a1a1a] shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col bg-[#050505] ring-1 ring-white/5">
                    {/* Camera Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1a1a1a] rounded-b-2xl z-50 flex items-center justify-center">
                       <div className="w-2 h-2 rounded-full bg-white/5" />
                    </div>

                    <div className="flex-1 relative overflow-auto">
                        {isLoading ? (
                          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
                             <motion.div
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-neon-purple"
                             >
                               <Zap size={48} className="fill-current" />
                             </motion.div>
                             <p className="mt-6 text-[10px] tracking-[0.4em] text-neon-purple animate-pulse">GENERATING UI...</p>
                          </div>
                        ) : error ? (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                             <AlertCircle className="text-red-500 mb-4" size={32} />
                             <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-widest">{error}</p>
                          </div>
                        ) : renderedPreview ? (
                          <div 
                            dangerouslySetInnerHTML={{ __html: renderedPreview }} 
                            className="w-full h-full animate-in fade-in zoom-in-95 duration-500"
                          />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center p-6 text-center opacity-20">
                             <Terminal size={64} className="mb-4" />
                             <p className="text-[10px] uppercase tracking-[0.3em]">Awaiting Input</p>
                          </div>
                        )}
                    </div>
                 </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Global Floating Actions */}
        <motion.button
           whileHover={{ scale: 1.1 }}
           whileTap={{ scale: 0.9 }}
           onClick={compileCode}
           disabled={isLoading}
           className="fixed bottom-10 right-10 w-16 h-16 rounded-full glass border-neon-purple/50 neon-glow flex items-center justify-center z-[100] group"
        >
           <div className="absolute inset-0 bg-neon-purple/20 group-hover:bg-neon-purple/40 transition-colors rounded-full" />
           <Zap size={32} className="text-neon-purple fill-current relative z-10" />
        </motion.button>
      </main>

      {/* Fullscreen Mode */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black flex flex-col"
          >
             <div className="h-16 glass flex items-center justify-between px-8">
                <span className="font-bold tracking-widest text-neon-purple">FULLSCREEN CANVAS</span>
                <button onClick={() => setIsFullscreen(false)} className="text-white/40 hover:text-white">
                  <Minimize2 size={24} />
                </button>
             </div>
             <div className="flex-1 flex items-center justify-center overflow-auto p-12">
                 <div className="w-full max-w-4xl h-full border border-white/5 rounded-3xl overflow-hidden bg-[#050505] shadow-2xl">
                    {renderedPreview && <div dangerouslySetInnerHTML={{ __html: renderedPreview }} className="w-full h-full" />}
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Bar */}
      <footer className="h-8 glass flex items-center justify-between px-4 text-[8px] text-white/20 tracking-[0.3em] font-mono uppercase">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]" />
              Core: active
           </div>
           <div>Mode: Simulation</div>
        </div>
        <div>System: Flutter Forge v1.2</div>
      </footer>
    </div>
  );
}
