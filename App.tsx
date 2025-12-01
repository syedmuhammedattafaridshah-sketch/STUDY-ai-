
import React, { useState, useEffect, useRef } from 'react';
import { UploadedFile, ExamConfig, GeneratedExam, Difficulty, QuestionType } from './types';
import { DEFAULT_CONFIG, APP_ACCESS_CODE } from './constants';
import { generateExamContent, chatWithStudyAI } from './services/geminiService';
import { generatePDF, generateAnswerKey } from './services/pdfGenerator';
import { 
  Upload, FileText, Settings, Download, Trash2, 
  X, Send, User, Zap, BrainCircuit, Activity, Layers, ShieldCheck,
  Type, Image as ImageIcon, Sparkles, MessageSquare, MoveUp, MoveDown, FileJson, FileType, AlertCircle, Cpu,
  Lock, Key, Share2, CheckCircle
} from 'lucide-react';

// --- Access Gate (Security Screen) ---
const AccessGate = ({ onUnlock }: { onUnlock: () => void }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = () => {
    if (code.toLowerCase() === APP_ACCESS_CODE) {
      setUnlocking(true);
      setTimeout(onUnlock, 1500);
    } else {
      setError(true);
      setTimeout(() => setError(false), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617] flex flex-col items-center justify-center font-tech overflow-hidden">
      <div className="absolute inset-0 circuit-bg opacity-20"></div>
      
      {/* Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className={`w-[500px] h-[500px] border border-slate-800 rounded-full absolute transition-all duration-1000 ${unlocking ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'}`}></div>
         <div className={`w-[400px] h-[400px] border border-slate-700 rounded-full absolute transition-all duration-1000 delay-100 ${unlocking ? 'scale-[3] opacity-0' : 'scale-100 opacity-100'}`}></div>
      </div>

      <div className={`relative z-10 flex flex-col items-center transition-all duration-1000 ${unlocking ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}`}>
        <div className="mb-8 relative">
           <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse"></div>
           <Lock size={64} className="text-cyan-400 relative z-10" />
        </div>
        
        <h1 className="text-3xl font-bold text-white tracking-[0.2em] mb-2 text-center">SECURE ACCESS</h1>
        <p className="text-slate-400 text-xs tracking-widest mb-8">ENTER AUTHORIZATION CODE</p>

        <div className={`relative group w-72 mb-6 transition-transform ${error ? 'translate-x-[-10px]' : ''} ${error ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
           <Key size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
           <input 
             type="password" 
             value={code}
             onChange={(e) => setCode(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
             className="w-full bg-slate-900/80 border border-slate-700 focus:border-cyan-500 rounded-full py-3 pl-12 pr-6 text-center text-white tracking-[0.5em] outline-none transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] focus:shadow-[0_0_20px_rgba(6,182,212,0.2)]"
             placeholder="••••••"
           />
        </div>

        <button 
          onClick={handleUnlock}
          className="w-72 py-3 bg-cyan-900/30 hover:bg-cyan-600 border border-cyan-500/50 rounded-full text-cyan-400 hover:text-white font-bold tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]"
        >
          {unlocking ? 'AUTHENTICATING...' : 'UNLOCK SYSTEM'}
        </button>

        {error && (
          <div className="mt-4 text-red-500 text-xs font-mono animate-pulse">
            ACCESS DENIED: INVALID CREDENTIALS
          </div>
        )}
      </div>
      
      <div className="absolute bottom-8 text-[10px] text-slate-600 font-mono">
        STUDY.AI SECURE GATEWAY V3.0
      </div>
    </div>
  );
};

// --- Luxury Intro Animation (7 Seconds) ---
const LuxuryIntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    // Sequence Logic
    const timeouts = [
      setTimeout(() => { setPhase(1); setText("INITIALIZING NEURAL CORE..."); }, 500),
      setTimeout(() => { setPhase(2); setText("ESTABLISHING SECURE LINK..."); }, 2500),
      setTimeout(() => { setPhase(3); setText("DECRYPTING BIOMETRIC ASSETS..."); }, 4500),
      setTimeout(() => { setPhase(4); setText("ACCESS GRANTED"); }, 6000),
      setTimeout(() => { onComplete(); }, 7000),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center overflow-hidden font-tech">
      <div className="absolute inset-0 circuit-bg opacity-30 animate-[spin_60s_linear_infinite]"></div>
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
         <div className="absolute top-0 left-10 text-xs text-green-500 font-mono animate-[slideUp_2s_infinite]">01010101</div>
         <div className="absolute top-20 right-20 text-xs text-cyan-500 font-mono animate-[slideUp_3s_infinite]">10101011</div>
      </div>

      <div className="relative">
        <div className={`w-80 h-80 rounded-full border border-cyan-500/30 flex items-center justify-center transition-all duration-1000 ${phase > 0 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
           <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full logo-spin-slow"></div>
           <div className="absolute inset-4 border-b-2 border-purple-500 rounded-full logo-spin-reverse"></div>
           <div className="absolute inset-8 border-l-2 border-r-2 border-white/20 rounded-full logo-spin-fluid"></div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
           <BrainCircuit size={64} className={`text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-700 ${phase > 2 ? 'scale-110 logo-pulse' : 'scale-90 opacity-50'}`} />
        </div>
      </div>

      <h1 className="mt-12 text-5xl font-bold tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-purple-400 animate-pulse">
        STUDY.AI
      </h1>
      
      <div className="mt-6 h-6 flex items-center gap-3">
         {phase < 4 && <Activity size={16} className="text-cyan-500 animate-bounce" />}
         <span className="text-cyan-500/80 tracking-widest text-sm font-mono uppercase typing-effect">{text}</span>
      </div>

      <div className="w-96 h-1 bg-slate-900 rounded-full mt-6 overflow-hidden border border-cyan-900/50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-600 to-purple-600 shadow-[0_0_15px_cyan] transition-all duration-[1500ms] ease-out" 
          style={{ width: `${phase * 25}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- Generation Overlay with Red Glow ---
const NeuralGenerationOverlay = ({ status }: { status: string }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020617]/95 backdrop-blur-3xl fade-in-anim font-tech">
    <div className="relative w-64 h-64 mb-10 flex items-center justify-center">
      <div className="absolute inset-0 border-4 border-red-600/20 rounded-full animate-ping" style={{animationDuration: '2s'}}></div>
      <div className="absolute inset-0 border-2 border-t-red-500 border-b-red-500 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-8 border-2 border-r-red-400 border-l-red-400 border-t-transparent border-b-transparent rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
      
      <div className="relative z-10 bg-red-950/30 p-6 rounded-full border border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
         <Cpu size={48} className="text-red-400 animate-pulse" />
      </div>
    </div>
    
    <div className="text-4xl text-transparent bg-clip-text bg-gradient-to-b from-red-300 to-red-600 font-bold tracking-widest uppercase mb-4 animate-text-red text-center drop-shadow-lg">
      {status}
    </div>
    
    <div className="flex gap-4 mt-4">
       <span className="w-20 h-1 bg-red-900 rounded-full overflow-hidden">
         <div className="h-full bg-red-500 animate-[shimmer_1s_infinite]"></div>
       </span>
       <span className="text-red-400/70 text-xs font-mono">PROCESSING NODES ACTIVE</span>
       <span className="w-20 h-1 bg-red-900 rounded-full overflow-hidden">
         <div className="h-full bg-red-500 animate-[shimmer_1s_infinite]" style={{animationDelay: '0.5s'}}></div>
       </span>
    </div>
  </div>
);

// --- Rich Text Renderer ---
const RichTextRenderer = ({ text }: { text: string }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <div className="leading-relaxed">
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          const glowClass = index % 3 === 0 ? 'glow-cyan' : (index % 3 === 1 ? 'glow-green' : 'glow-yellow');
          return <span key={index} className={`${glowClass} mx-1`}>{content}</span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </div>
  );
};

// --- Complex Logo Component ---
const EnhancedLogo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };
  const iconSize = { sm: 14, md: 20, lg: 40 };

  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center group`}>
      {/* Ring 1 - Slow Clockwise */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/50 border-t-cyan-400 logo-spin-slow"></div>
      {/* Ring 2 - Medium Counter-Clockwise */}
      <div className="absolute inset-[10%] rounded-full border border-purple-500/50 border-b-purple-400 logo-spin-reverse"></div>
      {/* Ring 3 - Fast Fluid */}
      <div className="absolute inset-[20%] rounded-full border border-white/20 border-l-white logo-spin-fluid"></div>
      {/* Core */}
      <div className="absolute inset-[30%] bg-cyan-500/20 rounded-full animate-pulse blur-[1px]"></div>
      <Zap size={iconSize[size]} className="text-cyan-400 fill-cyan-400 relative z-10 drop-shadow-[0_0_5px_cyan]" />
    </div>
  );
};

// --- Chat Assistant with Improved Thinking ---
const ChatAssistant = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) => {
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: 'Hello! I am **Study.AI**. Ready to engineer your **perfect exam**.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if(!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);
    
    const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));

    try {
      const response = await chatWithStudyAI(userMsg, history);
      setMessages(prev => [...prev, { role: 'model', text: response || "I couldn't process that request." }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: "**System Error**: Neural link unstable." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-slate-900 rounded-full shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all hover:scale-110 border border-cyan-400 overflow-hidden group btn-shine"
      >
        <div className="absolute inset-0 bg-cyan-500/10 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           {isOpen ? <X size={28} className="text-cyan-400"/> : <BrainCircuit size={32} className="text-cyan-400 group-hover:rotate-180 transition-transform duration-700"/>}
        </div>
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-40 w-80 md:w-96 h-[600px] glass-panel rounded-2xl flex flex-col overflow-hidden border border-cyan-500/40 slide-up-anim shadow-2xl">
          {/* Enhanced Chat Header with Branding */}
          <div className="p-4 bg-slate-900/95 border-b border-cyan-500/30 flex justify-between items-center backdrop-blur-md shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 circuit-bg opacity-10"></div>
            <div className="flex items-center gap-3 relative z-10">
               <EnhancedLogo size="sm" />
               <div className="flex flex-col">
                  <span className="font-tech text-white text-lg tracking-wider leading-none">STUDY<span className="text-cyan-400 neon-text">.AI</span></span>
                  <span className="text-[9px] text-cyan-500/70 font-mono tracking-[0.2em] uppercase">Assistant Online</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_lime]"></div>
               <Activity size={16} className="text-cyan-600 opacity-80"/>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-950 to-slate-900/90">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} slide-up-anim`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed backdrop-blur-sm border ${
                  m.role === 'user' 
                    ? 'bg-cyan-900/30 border-cyan-500/30 text-cyan-50 rounded-br-none' 
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-200 rounded-bl-none'
                }`}>
                  {m.role === 'user' ? m.text : <RichTextRenderer text={m.text} />}
                </div>
              </div>
            ))}
             {loading && (
               <div className="flex justify-start slide-up-anim">
                 <div className="bg-slate-800/50 p-4 rounded-2xl rounded-bl-none border border-slate-700/50 flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full dot-anim" style={{animationDelay:'0s'}}></div>
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full dot-anim" style={{animationDelay:'0.2s'}}></div>
                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full dot-anim" style={{animationDelay:'0.4s'}}></div>
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>
          
          <div className="p-3 bg-slate-900/90 border-t border-cyan-500/20 flex gap-2 backdrop-blur-md">
             <input 
               className="flex-1 bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] text-white placeholder-slate-600 outline-none transition-all font-mono"
               value={input}
               onChange={e => setInput(e.target.value)}
               onKeyDown={e => e.key === 'Enter' && sendMessage()}
               placeholder="Input parameters..."
             />
             <button onClick={sendMessage} className="p-3 bg-cyan-900/30 hover:bg-cyan-800/50 border border-cyan-500/50 rounded-xl transition-all group">
               <Send size={18} className="text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
             </button>
          </div>
        </div>
      )}
    </>
  );
};

// --- Main App ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [config, setConfig] = useState<ExamConfig>(() => {
    const saved = localStorage.getItem('studyAiConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null);
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  useEffect(() => { localStorage.setItem('studyAiConfig', JSON.stringify(config)); }, [config]);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const reader = new FileReader();
      
      const fileData = await new Promise<UploadedFile | null>((resolve) => {
        reader.onload = async (evt) => {
          const result = evt.target?.result as string;
          let data = result;
          let mimeType = file.type;
          
          if (file.name.endsWith('.docx')) {
             const arrayBuffer = await file.arrayBuffer();
             const { value } = await window.mammoth.extractRawText({ arrayBuffer });
             data = btoa(value); mimeType = 'text/plain';
          } else if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
             data = result.split(',')[1];
          } else {
             data = btoa(result); mimeType = 'text/plain';
          }

          resolve({ name: file.name, type: file.type, data: data, mimeType: mimeType });
        };
        
        if (file.name.endsWith('.docx')) resolve(null); 
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) reader.readAsDataURL(file);
        else reader.readAsText(file);
      });
      
      if (file.name.endsWith('.docx')) {
          const ab = await file.arrayBuffer();
          const { value } = await window.mammoth.extractRawText({ arrayBuffer: ab });
          newFiles.push({ name: file.name, type: file.type, data: btoa(value), mimeType: 'text/plain' });
      } else if (fileData) {
          newFiles.push(fileData);
      }
    }
    setFiles([...files, ...newFiles]);
  };

  const removeFile = (idx: number) => setFiles(files.filter((_, i) => i !== idx));

  const startGeneration = async () => {
    if (files.length === 0) { setErrorMsg("Upload source data required."); return; }
    setErrorMsg(null);
    setLoadingStep("INITIALIZING NEURAL NET...");
    
    try {
      setTimeout(() => setLoadingStep("PARSING RAW DATA..."), 2000);
      setTimeout(() => setLoadingStep("ANALYZING CONCEPTS..."), 4000);
      setTimeout(() => setLoadingStep("CONSTRUCTING EXAM MATRIX..."), 6000);

      const result = await generateExamContent(files, config);
      setGeneratedExam(result);
      setLoadingStep(null);
    } catch (err: any) {
      setLoadingStep(null);
      setErrorMsg(err.message || "Generation Failed.");
    }
  };

  const updateQuestion = (idx: number, field: string, val: any) => {
    if (!generatedExam) return;
    const newQs = [...generatedExam.questions];
    newQs[idx] = { ...newQs[idx], [field]: val };
    setGeneratedExam({ ...generatedExam, questions: newQs });
  };
  const deleteQuestion = (idx: number) => {
    if (!generatedExam) return;
    setGeneratedExam({ ...generatedExam, questions: generatedExam.questions.filter((_, i) => i !== idx) });
  };
  const moveQuestion = (idx: number, dir: -1 | 1) => {
     if(!generatedExam) return;
     const qs = [...generatedExam.questions];
     if (idx + dir < 0 || idx + dir >= qs.length) return;
     [qs[idx], qs[idx+dir]] = [qs[idx+dir], qs[idx]];
     setGeneratedExam({ ...generatedExam, questions: qs });
  };
  const downloadPDF = () => generatedExam && generatePDF(generatedExam.questions, config);
  const downloadKey = () => generatedExam && generateAnswerKey(generatedExam.questions, config);
  const downloadJSON = () => {
    if (!generatedExam) return;
    const blob = new Blob([JSON.stringify(generatedExam, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${config.examName.replace(/\s+/g, '_')}.json`;
    a.click();
  };
  const downloadText = () => {
    if (!generatedExam) return;
    let text = `${config.examName}\n\n`;
    generatedExam.questions.forEach((q, i) => text += `${i+1}. ${q.question}\n\n`);
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${config.examName.replace(/\s+/g, '_')}.txt`;
    a.click();
  };

  // --- Auth & Loading Flow ---
  if (!isAuthenticated) return <AccessGate onUnlock={() => setIsAuthenticated(true)} />;
  if (appLoading) return <LuxuryIntroLoader onComplete={() => setAppLoading(false)} />;
  if (loadingStep) return <NeuralGenerationOverlay status={loadingStep} />;

  return (
    <div className="min-h-screen pb-20 text-slate-200 selection:bg-cyan-500/30 font-inter">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-30 slide-up-anim shadow-lg shadow-black/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group">
             <EnhancedLogo size="md" />
             <span className="font-tech text-2xl tracking-wider text-white group-hover:text-cyan-400 transition-colors">STUDY<span className="text-cyan-400">.AI</span></span>
          </div>
          <div className="flex gap-4 md:gap-6 items-center">
             <button onClick={handleShareLink} className={`hidden md:flex px-4 py-2 border rounded-full text-xs font-bold tracking-widest items-center gap-2 transition-all ${copiedLink ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-cyan-500'}`}>
                {copiedLink ? <CheckCircle size={14}/> : <Share2 size={14} />}
                {copiedLink ? 'LINK COPIED' : 'GET PUBLIC LINK'}
             </button>
             <button onClick={() => setChatOpen(!chatOpen)} className="flex px-4 py-2 bg-cyan-900/20 border border-cyan-500/50 rounded-full text-cyan-400 hover:bg-cyan-900/40 hover:scale-105 transition-all items-center gap-2 font-tech tracking-wider text-xs shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                <MessageSquare size={14} className="animate-pulse" /> AI ASSISTANT
             </button>
             <a href="#about" className="hidden md:flex text-xs tracking-[0.2em] text-slate-400 hover:text-cyan-400 transition-colors font-tech items-center gap-2">
                <User size={14}/> CREATOR
             </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 space-y-8 fade-in-anim">
          {/* Hero */}
          <header className="relative text-center py-20 rounded-3xl circuit-bg border border-slate-800 overflow-hidden shadow-2xl shadow-black/80">
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
             <div className="relative z-10 flex flex-col items-center">
                <div className="px-4 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono mb-8 tracking-widest uppercase animate-pulse">
                  System Online • V3.0
                </div>
                <h1 className="text-6xl md:text-9xl font-tech mb-6 text-white tracking-tighter drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]">
                  STUDY<span className="text-cyan-400 neon-text">.AI</span>
                </h1>
                <p className="text-slate-400 text-xl font-light tracking-wide max-w-2xl mx-auto">
                  Advanced Document Parsing & Assessment Generation
                </p>
                <div className="mt-8 flex items-center gap-4">
                   <div className="h-px w-12 bg-slate-700"></div>
                   <p className="text-cyan-600 font-mono text-[10px] tracking-[0.3em] uppercase">CREATED BY MUHAMMAD ATTA FARID SHAH</p>
                   <div className="h-px w-12 bg-slate-700"></div>
                </div>
             </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Config Panel */}
            <div className="lg:col-span-4 space-y-6 slide-up-anim" style={{animationDelay: '0.2s'}}>
              
              {/* Upload */}
              <div className="glass-panel p-1 rounded-xl">
                <div className="bg-[#0f172a]/90 p-6 rounded-lg">
                  <h3 className="text-sm font-bold text-cyan-400 mb-6 flex items-center gap-2 font-tech tracking-widest border-b border-slate-800 pb-4">
                     <Upload size={16} /> DATA SOURCE
                  </h3>
                  <div className="border border-dashed border-slate-700 hover:border-cyan-500/50 rounded-lg p-8 text-center transition-all relative group bg-slate-900/50">
                    <input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-lg">
                       <FileText className="text-slate-500 group-hover:text-cyan-400" size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-mono">DROP DOCUMENTS HERE</p>
                  </div>
                  <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                    {files.map((f, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] font-mono text-cyan-100 truncate w-4/5">{f.name}</span>
                        <button onClick={() => removeFile(i)} className="text-slate-600 hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Params */}
              <div className="glass-panel p-1 rounded-xl">
                 <div className="bg-[#0f172a]/90 p-6 rounded-lg">
                    <h3 className="text-sm font-bold text-purple-400 mb-6 flex items-center gap-2 font-tech tracking-widest border-b border-slate-800 pb-4">
                      <Settings size={16} /> CONFIGURATION
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-2 block">Exam Title</label>
                        <input className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-sm focus:border-purple-500 outline-none text-white"
                          value={config.examName} onChange={(e) => setConfig({...config, examName: e.target.value})}
                        />
                      </div>

                      {/* Question Types Grid */}
                      <div>
                        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-3 block">Question Matrix</label>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { label: 'MCQ', key: 'mcqCount' }, { label: 'True/False', key: 'tfCount' },
                             { label: 'Short Ans', key: 'shortCount' }, { label: 'Fill Blank', key: 'fillCount' },
                             { label: 'Matching', key: 'matchingCount' }, { label: 'Long Ans', key: 'longAnswerCount' },
                             { label: 'Essay', key: 'essayCount' }
                           ].map((t) => (
                             <div key={t.key} className="flex items-center justify-between bg-slate-950 p-2 rounded border border-slate-800">
                                <span className="text-[10px] font-bold text-slate-400">{t.label}</span>
                                <input type="number" min="0" className="w-12 bg-transparent text-right text-purple-300 text-sm outline-none font-mono"
                                  value={config[t.key as keyof ExamConfig] as number}
                                  onChange={e => setConfig({...config, [t.key]: parseInt(e.target.value) || 0})}
                                />
                             </div>
                           ))}
                        </div>
                      </div>

                      {/* Difficulty Grid */}
                      <div>
                        <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-3 block">Complexity Level</label>
                        <div className="flex flex-wrap gap-2">
                          {Object.values(Difficulty).map((d) => (
                            <button key={d} onClick={() => setConfig({...config, difficulty: d})}
                              className={`px-3 py-2 text-[10px] uppercase font-bold rounded border transition-all flex-1 ${
                                config.difficulty === d ? 'bg-purple-900/40 border-purple-500 text-purple-200' : 'bg-slate-950 border-slate-800 text-slate-500'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* PDF Customization */}
                      <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-3">
                          <label className="text-[10px] uppercase text-slate-500 font-bold tracking-wider block border-b border-slate-800 pb-1">PDF Styling</label>
                          <div className="flex items-center justify-between">
                             <span className="text-xs text-slate-400 flex gap-2 items-center"><Type size={12}/> Header Size</span>
                             <input type="number" className="w-12 bg-slate-900 border border-slate-800 rounded text-right text-xs p-1" value={config.headerFontSize} onChange={(e) => setConfig({...config, headerFontSize: parseInt(e.target.value)})} />
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs text-slate-400 flex gap-2 items-center"><Sparkles size={12}/> Font Theme</span>
                             <select 
                               className="bg-slate-900 border border-slate-800 rounded text-xs p-1 text-right text-white outline-none"
                               value={config.pdfFontTheme || 'Classic'}
                               onChange={(e) => setConfig({...config, pdfFontTheme: e.target.value as any})}
                             >
                               <option value="Modern">Modern (Sans)</option>
                               <option value="Classic">Classic (Hybrid)</option>
                               <option value="Elegant">Elegant (Serif)</option>
                             </select>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs text-slate-400 flex gap-2 items-center"><ImageIcon size={12}/> Show Logo</span>
                             <button onClick={() => setConfig({...config, showLogo: !config.showLogo})} className={`w-8 h-4 rounded-full relative transition-colors ${config.showLogo ? 'bg-cyan-600' : 'bg-slate-800'}`}>
                                <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.showLogo ? 'left-4.5' : 'left-0.5'}`}></div>
                             </button>
                          </div>
                      </div>

                      {/* Watermark */}
                      <div className="bg-slate-950 p-3 rounded border border-slate-800">
                          <div className="flex justify-between mb-2">
                             <label className="text-[10px] uppercase text-slate-500 font-bold">Watermark</label>
                             <span className="text-[10px] text-purple-400">{Math.round(config.watermarkOpacity*100)}%</span>
                          </div>
                          <input className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs mb-2 text-white" 
                              value={config.watermarkText} onChange={e => setConfig({...config, watermarkText: e.target.value})}
                          />
                          <input type="range" min="0" max="1" step="0.1" className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
                              value={config.watermarkOpacity} onChange={e => setConfig({...config, watermarkOpacity: parseFloat(e.target.value)})}
                          />
                      </div>

                      {/* Generate Button */}
                      <button 
                        onClick={startGeneration}
                        disabled={files.length === 0}
                        className={`w-full py-4 rounded-lg font-bold font-tech tracking-[0.1em] flex items-center justify-center gap-2 transition-all shadow-lg mt-6 relative overflow-hidden group btn-shine
                          ${files.length > 0 ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-cyan-900/50 hover:shadow-cyan-500/50 hover:scale-[1.02]' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                        `}
                      >
                         <Zap fill="currentColor" size={18} className={files.length > 0 ? "animate-pulse" : ""} /> 
                         GENERATE TEST
                      </button>
                      
                      {errorMsg && (
                        <div className="text-red-400 text-[10px] bg-red-950/20 p-2 rounded border border-red-500/20 flex gap-2 items-center font-mono uppercase">
                          <AlertCircle size={12} /> {errorMsg}
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="lg:col-span-8 slide-up-anim" style={{animationDelay: '0.3s'}}>
              <div className="glass-panel min-h-[850px] rounded-xl flex flex-col relative overflow-hidden border border-slate-700 shadow-2xl">
                
                {/* Preview Toolbar */}
                <div className="p-4 border-b border-slate-700 bg-[#0f172a] flex justify-between items-center backdrop-blur-md">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="font-tech text-sm text-slate-300 tracking-wider">LIVE PREVIEW</span>
                  </div>
                  {generatedExam && (
                    <div className="flex gap-2">
                       <button onClick={downloadJSON} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-600"><FileJson size={16} /></button>
                       <button onClick={downloadText} className="p-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-600"><FileType size={16} /></button>
                       <button onClick={downloadKey} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-cyan-400 border border-slate-600 flex gap-2 items-center"><ShieldCheck size={14}/> KEY</button>
                       <button onClick={downloadPDF} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded text-xs font-bold text-white shadow-[0_0_15px_rgba(22,163,74,0.4)] flex gap-2 items-center font-tech tracking-wide"><Download size={14}/> EXPORT PDF</button>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto bg-[#f8fafc] text-slate-900 relative">
                  {!generatedExam ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617] z-10">
                       <div className="w-48 h-48 border border-slate-800 rounded-full flex items-center justify-center mb-6 relative">
                         <div className="absolute inset-0 border border-cyan-500/20 rounded-full logo-spin-slow"></div>
                         <div className="absolute inset-4 border border-cyan-500/10 rounded-full logo-spin-reverse"></div>
                         <Layers size={64} className="text-slate-700"/>
                       </div>
                       <p className="text-3xl font-tech text-slate-600 tracking-widest uppercase">Awaiting Data</p>
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto bg-white p-12 min-h-full shadow-lg">
                      <div className="text-center border-b-2 border-black pb-6 mb-8">
                        <h2 className="text-4xl font-luxury font-bold text-black uppercase mb-2">{config.examName}</h2>
                        <p className="text-slate-600 italic font-serif text-lg">{config.subtitle}</p>
                        <div className="flex justify-between mt-10 text-sm font-bold font-serif pt-4 border-t border-slate-200">
                            <span>Name: _______________________</span>
                            <span>Score: _______ / 100</span>
                        </div>
                      </div>

                      {generatedExam.questions.map((q, idx) => (
                        <div key={q.id} className="group relative mb-8 pb-6 border-b border-slate-100 last:border-0 hover:bg-blue-50/50 p-6 -mx-6 rounded transition-colors">
                           <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 flex gap-1 bg-white shadow-md p-1 rounded border border-slate-200 z-10">
                              <button onClick={() => moveQuestion(idx, -1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><MoveUp size={14} /></button>
                              <button onClick={() => moveQuestion(idx, 1)} className="p-1 hover:bg-slate-100 rounded text-slate-500"><MoveDown size={14} /></button>
                              <button onClick={() => deleteQuestion(idx)} className="p-1 hover:bg-red-50 text-red-500 rounded"><Trash2 size={14} /></button>
                           </div>
                           
                           <div className="flex gap-4">
                              <div className="font-bold text-black font-luxury text-xl w-8">{idx + 1}.</div>
                              <div className="flex-1">
                                <div contentEditable suppressContentEditableWarning className="text-black mb-3 focus:outline-none focus:bg-yellow-50 rounded font-serif text-lg leading-relaxed">{q.question}</div>
                                
                                {q.type === 'MCQ' && q.options && (
                                  <div className="grid gap-2 ml-2">
                                    {q.options.map((opt, oid) => (
                                      <div key={oid} className="text-slate-800 flex gap-3 font-serif">
                                        <span className="font-bold">({String.fromCharCode(97+oid)})</span> {opt}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                
                                {q.type === 'MATCHING' && q.pairs && (
                                   <div className="mt-4 grid grid-cols-2 gap-8 text-sm font-serif text-slate-800 bg-slate-50 p-4 rounded border border-slate-200">
                                      <div className="space-y-2">
                                         <div className="font-bold border-b pb-1 mb-2">Column A</div>
                                         {q.pairs.map((p, i) => <div key={i}>{i+1}. {p.left}</div>)}
                                      </div>
                                      <div className="space-y-2">
                                         <div className="font-bold border-b pb-1 mb-2">Column B</div>
                                         {q.pairs.map((p, i) => <div key={i}>{String.fromCharCode(65+i)}. {p.right}</div>)}
                                      </div>
                                   </div>
                                )}
                                
                                {['LONG_ANSWER', 'ESSAY', 'SHORT_ANSWER'].includes(q.type) && (
                                    <div className="mt-4 space-y-3 opacity-30">
                                        {[...Array(q.type==='SHORT_ANSWER'?2:5)].map((_,i) => <div key={i} className="h-px bg-black w-full"></div>)}
                                    </div>
                                )}
                                
                                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{q.type}</span>
                                  <span className="text-[9px] uppercase font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{q.difficulty}</span>
                                </div>
                              </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <section id="about" className="glass-panel p-8 rounded-xl mt-12 slide-up-anim border border-cyan-500/10 relative overflow-hidden bg-gradient-to-r from-slate-900 to-[#020617]">
             <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-cyan-900/10 to-transparent"></div>
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 rounded-full bg-slate-950 border-2 border-cyan-500 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                   <span className="font-tech text-2xl text-white">AF</span>
                </div>
                <div>
                   <h2 className="text-xl font-tech text-white mb-2 tracking-widest">SYSTEM ARCHITECT</h2>
                   <h3 className="text-lg text-cyan-400 mb-4 font-bold">Muhammad Atta Farid Shah</h3>
                   <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
                     Study.AI is a cutting-edge platform designed to revolutionize how students and educators create assessments.
                   </p>
                </div>
             </div>
          </section>
      </div>

      <ChatAssistant isOpen={chatOpen} setIsOpen={setChatOpen} />
    </div>
  );
}
