import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, MessageSquare, Code, FileText, Zap, ArrowRight, User, MoveRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DOWNLOAD_URL = import.meta.env.VITE_DOWNLOAD_URL;

const SUGGESTIONS = {
  email: "I think we should proceed with the deployment tomorrow...",
  whatsapp: "I've double-checked the latency values and we're good to launch...",
  editor: "Sort the stream by obsidian frequency before returning...",
  form: "Shah Nawaz | shahnawaz@gmail.com | I am excited to apply for this role because my experience aligns perfectly with your engineering scaling targets..."
};

export function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'editor' | 'form'>('email');
  const [keysPressed, setKeysPressed] = useState({
    ctrl: false,
    alt: false,
    arrowRight: false
  });
  const [typedCount, setTypedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const handleKeyToggle = (key: 'ctrl' | 'alt' | 'arrowRight') => {
    setKeysPressed(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (next.ctrl && next.alt && next.arrowRight) {
        if (typedCount === 0 && !isTyping) {
          setIsTyping(true);
          return { ctrl: false, alt: false, arrowRight: false }; // Immediate deselect
        }
      }
      return next;
    });
  };

  useEffect(() => {
    setTypedCount(0);
    setIsTyping(false);
  }, [activeTab]);

  useEffect(() => {
    if (keysPressed.ctrl && keysPressed.alt && keysPressed.arrowRight) {
      if (typedCount === 0 && !isTyping) {
        setIsTyping(true);
        setKeysPressed({ ctrl: false, alt: false, arrowRight: false }); // Immediate deselect
      }
    }
  }, [keysPressed.ctrl, keysPressed.alt, keysPressed.arrowRight, typedCount, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const currentFullText = SUGGESTIONS[activeTab];
      if (typedCount < currentFullText.length) {
        // Speed up the cover letter field (which is the 3rd item in form suggestion string)
        const isFormCoverLetter = activeTab === 'form' && currentFullText.slice(0, typedCount).split('|').length >= 3;
        
        const timeout = setTimeout(() => {
          setTypedCount(prev => prev + 1);
        }, isFormCoverLetter ? 10 : 45);
        return () => clearTimeout(timeout);
      } else {
        setIsTyping(false);
      }
    }
  }, [isTyping, typedCount, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') setKeysPressed(prev => ({ ...prev, ctrl: true }));
      if (e.key === 'Alt') setKeysPressed(prev => ({ ...prev, alt: true }));
      if (e.key === 'ArrowRight') setKeysPressed(prev => ({ ...prev, arrowRight: true }));
      if (e.key === 'Escape') {
        setIsTyping(false);
        setTypedCount(0);
        setKeysPressed({ ctrl: false, alt: false, arrowRight: false });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') setKeysPressed(prev => ({ ...prev, ctrl: false }));
      if (e.key === 'Alt') setKeysPressed(prev => ({ ...prev, alt: false }));
      if (e.key === 'ArrowRight') setKeysPressed(prev => ({ ...prev, arrowRight: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getTabClass = (tab: string) => 
    activeTab === tab 
      ? "flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/20 border border-primary/30 text-primary transition-all"
      : "flex items-center gap-1 md:gap-2 px-2 py-1.5 md:px-4 md:py-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-all";

  return (
    <div id="home" className="relative pt-12 pb-12 md:pt-16 md:pb-16 overflow-hidden">
      <style>{`
        @keyframes caret-blink {
          50% { border-color: transparent }
        }
        .custom-caret {
          animation: caret-blink 1s step-end infinite;
          border-right-width: 2px;
          padding-right: 2px;
        }
      `}</style>
      <section className="relative px-6 md:px-8 py-2 md:py-4 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
      {/* Headline Cluster */}
      <div className="z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6 text-xs font-label font-bold uppercase tracking-[0.18em] text-primary">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Day {Math.floor((Date.now() - new Date('2026-03-06').getTime()) / 86_400_000)} of building · Just getting started
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-6xl font-headline font-bold tracking-tight text-on-surface mb-4 leading-[1.1]">
          Intento: Your <span className="text-[#BB9EFF]">AI-powered</span> typing assistant.
        </h1>
        <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mx-auto mb-6 leading-relaxed">
          Intento lives on your desktop and helps you write smarter, faster responses wherever your cursor is.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
              onClick={() => {
                if (user) {
                  navigate('/download');
                } else {
                  navigate('/auth?next=/download');
                }
              }}
              className="w-full sm:w-auto obsidian-gradient text-on-primary-fixed font-headline font-bold px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
              Download for Desktop
            </button>
          <button className="w-full sm:w-auto bg-surface-container-high text-secondary font-headline font-bold px-8 py-4 rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-colors">
            View Demo
          </button>
        </div>
      </div>

      {/* Visual Focus: Interactive HUD & Keyboard */}
      <div className="mt-4 md:mt-6 relative w-full max-w-4xl flex-1 flex flex-col justify-center">

        {/* Main Device Mockup Container */}
        <div className="relative bg-surface-container-low rounded-3xl border border-outline-variant/20 p-2 md:p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          {/* Context Switcher (App Selection) */}
          <div className="flex justify-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-surface-container-high p-1 rounded-full border border-outline-variant/10">
              <button onClick={() => setActiveTab('email')} className={getTabClass('email')}>
                <Mail className="w-4 h-4" />
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Email</span>
              </button>
              <button onClick={() => setActiveTab('whatsapp')} className={getTabClass('whatsapp')}>
                <MessageSquare className="w-4 h-4" />
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">WhatsApp</span>
              </button>
              <button onClick={() => setActiveTab('editor')} className={getTabClass('editor')}>
                <Code className="w-4 h-4" />
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Editor</span>
              </button>
              <button onClick={() => setActiveTab('form')} className={getTabClass('form')}>
                <FileText className="w-4 h-4" />
                <span className="text-[10px] font-label font-bold uppercase tracking-wider">Form</span>
              </button>
            </div>
          </div>

          {/* Dynamic Application UI & Suggestions */}
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-4 md:p-5 mb-3 text-left min-h-[180px] md:min-h-[220px] flex flex-col justify-center overflow-hidden group">
            
            {activeTab === 'email' && (
              <>
                {/* App Header Mock */}
                <div className="flex items-center gap-2 mb-4 opacity-40">
                  <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                  <div className="ml-2 h-4 w-32 bg-surface-container-high rounded-full"></div>
                </div>

                {/* Typing Area with Suggestions */}
                <div className="relative font-body text-lg leading-relaxed">
                  <div className="text-on-surface font-semibold mb-2 block break-words">Subject: Next Steps for the Obsidian Protocol</div>
                  <div className="mt-2">
                    <span className="text-on-surface border-secondary custom-caret">Hi Shah, I've reviewed the latest build. {SUGGESTIONS.email.slice(0, typedCount)}</span><span className="text-primary/50 relative">
                      {SUGGESTIONS.email.slice(typedCount)}
                      {/* Tooltip trigger on Desktop */}
                      {typedCount === 0 && (
                        <div className="absolute -top-14 right-0 md:left-0 md:right-auto glass-panel border border-primary/40 rounded-lg px-2 py-1.5 md:px-4 md:py-2 shadow-2xl animate-pulse-glow z-20 max-w-[200px] md:max-w-none">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Zap className="text-primary w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">ALT</kbd>
                              <kbd className="px-1 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/40 flex items-center justify-center">
                                        <MoveRight className="w-3 h-2.1" strokeWidth={2} />
                                      </kbd>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Apply</span>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>

              </>
            )}

            {activeTab === 'whatsapp' && (
              <>
                {/* WhatsApp Header Mock */}
                <div className="flex items-center gap-4 mb-4 border-b border-outline-variant/10">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">Product Design Team</div>
                    <div className="text-[10px] text-secondary font-label uppercase tracking-widest">online</div>
                  </div>
                </div>
                {/* Chat Bubbles */}
                <div className="space-y-4 max-w-xxl">
                  <div className="bg-surface-container-high rounded-2xl rounded-tl-none p-4 text-sm text-on-surface-variant max-w-[85%]">
                    <span className="font-bold text-secondary text-[10px] block mb-1">Shah</span>
                    Just saw the final obsidian kinetic animations. Are we ready for the 2.0 release tomorrow?
                  </div>
                  {/* User Typing with AI Suggestion */}
                  <div className="ml-auto bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-4 text-sm text-on-surface max-w-[85%] relative">
                    <span className="text-on-surface border-secondary custom-caret">Yeah, everything looks solid. {SUGGESTIONS.whatsapp.slice(0, typedCount)}</span><span className="text-primary/50 relative">
                      {SUGGESTIONS.whatsapp.slice(typedCount)}
                      {/* Tooltip trigger on Desktop */}
                      {typedCount === 0 && (
                        <div className="absolute -top-12 right-0 glass-panel border border-primary/40 rounded-lg px-2 py-1.5 md:px-4 md:py-2 shadow-2xl animate-pulse-glow z-20 max-w-[200px] md:max-w-none">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Zap className="text-primary w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">ALT</kbd>
                              <kbd className="px-1 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/40 flex items-center justify-center">
                                        <MoveRight className="w-3 h-2.1" strokeWidth={2} />
                                      </kbd>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Apply</span>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>

              </>
            )}

            {activeTab === 'editor' && (
              <>
                {/* Editor Header Mock */}
                <div className="flex items-center justify-between mb-6 opacity-40">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-tertiary"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                    <div className="ml-4 flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span className="text-[10px] font-mono tracking-wider">main.py</span>
                    </div>
                  </div>
                  <div className="h-4 w-24 bg-surface-container-high rounded-full"></div>
                </div>

                {/* Typing Area with Suggestions (Python Snippet) */}
                <div className="relative font-mono text-[13px] md:text-sm leading-relaxed text-on-surface/80">
                  <div><span className="text-tertiary">def</span> <span className="text-secondary">analyze_protocol</span>(data):</div>
                  <div className="pl-4 mt-1"><span className="text-outline">"""Processes incoming obsidian telemetry"""</span></div>
                  <div className="pl-4 mt-1"><span className="text-primary">if</span> not data: <span className="text-primary">return</span> <span className="text-secondary">None</span></div>
                  <div className="pl-4 mt-1">
                    <span>processed_stream = [d.hex() </span><span className="text-primary">for</span><span> d </span><span className="text-primary">in</span><span> data]</span>
                  </div>
                  <div className="pl-4 mt-1 block break-words">
                    <span className="text-on-surface border-secondary custom-caret"># {SUGGESTIONS.editor.slice(0, typedCount)}</span><span className={`text-primary/50 relative ${typedCount === 0 ? 'ml-1' : ''}`}>
                      {SUGGESTIONS.editor.slice(typedCount)}
                      {/* Shortcut Tooltip Overlay on Desktop */}
                      {typedCount === 0 && (
                        <div className="absolute -top-14 left-0 md:left-0 md:right-auto glass-panel border border-primary/40 rounded-lg px-2 py-1.5 md:px-4 md:py-2 shadow-2xl animate-pulse-glow z-20 max-w-[200px] md:max-w-none">
                          <div className="flex items-center gap-2 md:gap-3">
                            <Zap className="text-primary w-3 h-3 md:w-4 md:h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[9px] md:text-[10px] text-primary font-mono font-bold">ALT</kbd>
                             <kbd className="px-1 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/40 flex items-center justify-center">
                                        <MoveRight className="w-3 h-2.1" strokeWidth={2} />
                                      </kbd>
                            </div>
                            <span className="text-[9px] md:text-[10px] font-label text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Apply Suggestion</span>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>

              </>
            )}

            {activeTab === 'form' && (
              <>
                {/* macOS Style Window Header Mockup */}
                <div className="flex items-center justify-between mb-3 border-b border-outline-variant/5 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#E15A60] opacity-80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#9980FA] opacity-80"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1289A7] opacity-80"></div>
                    <div className="ml-3 flex items-center gap-1.5 text-on-surface/50">
                    <FileText className="w-3.5 h-3.5" />
                       <span className="text-[10px] font-mono tracking-wide">Job Application</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-on-surface/80">
                  {(() => {
                    const sliced = SUGGESTIONS.form.slice(0, typedCount);
                    const fields = sliced.split('|');
                    const fullFields = SUGGESTIONS.form.split('|');
                    
                    return (
                      <>
                        {/* Card 1: Name */}
                        <div className="bg-surface-container-low rounded-xl p-2 px-3 border border-outline-variant/10 text-left">
                          <label className="block text-[11px] font-bold text-on-surface mb-1">Full Name</label>
                          <div className="bg-transparent border-b border-outline-variant/30 focus-within:border-[#A061C3] py-0.5 font-mono text-xs transition-colors">
                            <span className="text-on-surface">{fields[0] || ""}</span>
                            {fields.length === 1 && typedCount < fullFields[0].length && <span className="border-secondary custom-caret"></span>}
                            {typedCount === 0 && <span className="text-on-surface/30 text-[11px]">Enter your name</span>}
                          </div>
                        </div>

                        {/* Card 2: Email */}
                        <div className="bg-surface-container-low rounded-xl p-2 px-3 border border-outline-variant/10 text-left">
                          <label className="block text-[11px] font-bold text-on-surface mb-1">Email</label>
                          <div className="bg-transparent border-b border-outline-variant/30 focus-within:border-[#A061C3] py-0.5 font-mono text-xs transition-colors">
                             <span className="text-on-surface">{fields[1] || ""}</span>
                             {fields.length === 2 && typedCount < (fullFields[0].length + 1 + fullFields[1].length) && <span className="border-secondary custom-caret"></span>}
                             {fields.length < 2 && <span className="text-on-surface/30 text-[11px]">example@gmail.com</span>}
                          </div>
                        </div>

                        {/* Card 3: Cover Letter */}
                        <div className="bg-surface-container-low rounded-xl p-2 px-3 border border-outline-variant/10 relative text-left">
                          <label className="block text-[11px] font-bold text-on-surface mb-1">Cover Letter</label>
                          <div className="bg-transparent border border-outline-variant/30 rounded-lg focus-within:border-[#A061C3] p-2 font-mono text-xs min-h-[60px] block break-words transition-colors">
                             <span className="text-on-surface">{fields[2] || ""}</span>
                             {fields.length === 3 && typedCount < SUGGESTIONS.form.length && <span className="border-secondary custom-caret"></span>}
                             {fields.length < 3 && <span className="text-on-surface/30 text-[11px]">Why do you want this job?...</span>}
                             
                             {typedCount === 0 && (
                               <div className="absolute top-4 right-4 glass-panel border border-primary/40 rounded-lg px-2 py-1 shadow-2xl animate-pulse-glow z-20">
                                 <div className="flex items-center gap-1.5">
                                   <Zap className="text-primary w-3 h-3" fill="currentColor" />
                                   <div className="flex items-center gap-0.5">
                                     <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[8px] text-primary font-mono font-bold">CTRL</kbd>
                                     <kbd className="px-1 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[8px] text-primary font-mono font-bold">ALT</kbd>
                                      <kbd className="px-1 py-0.5 rounded bg-secondary/20 text-secondary border border-secondary/40 flex items-center justify-center">
                                        <MoveRight className="w-3 h-2.1" strokeWidth={2} />
                                      </kbd>
                                   </div>
                                 </div>
                               </div>
                             )}
                          </div>
                        </div>

                        <div className="flex justify-start mt-2">
                          <button 
                            disabled={typedCount < SUGGESTIONS.form.length}
                            onClick={() => {
                              if (typedCount >= SUGGESTIONS.form.length) {
                                setTypedCount(0);
                                setIsTyping(false);
                              }
                            }}
                            className={`bg-[#673AB7] text-white font-headline font-semibold px-4 py-1 rounded shadow transition-colors text-xs ${typedCount < SUGGESTIONS.form.length ? 'opacity-40 cursor-not-allowed border border-[#673AB7]/50' : 'hover:bg-[#5E35B1] active:scale-95 border border-[#673AB7] hover:scale-[1.02]'}`}
                          >
                            Submit
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </>
            )}

            {/* Scanline Effect for AI Activity */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-1/2 w-full -translate-y-full animate-scan pointer-events-none"></div>
          </div>


          {/* Prominent Stylized Dark Keyboard */}
          <div className="bg-[#111111] p-3 md:p-4 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-2 mt-2">
            {/* Row 1 */}
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  setIsTyping(false);
                  setTypedCount(0);
                  setKeysPressed({ ctrl: false, alt: false, arrowRight: false });
                }}
                className="w-10 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center justify-center text-[9px] text-white/50 font-bold hover:bg-white/10 active:translate-y-[1px] select-none">
                ESC
              </button>
              <div className="flex-1 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="w-10 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
            </div>
            
            {/* Row 2 */}
            <div className="flex gap-2">
              <div className="w-16 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="flex-1 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="w-16 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
            </div>
            
            {/* Row 3 */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleKeyToggle('ctrl')}
                className={`w-20 h-10 md:h-12 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-75 select-none ${
                  !isTyping && keysPressed.ctrl 
                    ? 'bg-primary/30 border-2 border-primary shadow-[0_0_25px_rgba(187,158,255,0.4)] translate-y-[2px] text-primary' 
                    : 'bg-primary/10 border-2 border-primary/50 shadow-[0_0_15px_rgba(187,158,255,0.15)] text-primary'
                }`}>
                CTRL
              </button>
              <button 
                onClick={() => handleKeyToggle('alt')}
                className={`w-20 h-10 md:h-12 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-75 select-none ${
                  !isTyping && keysPressed.alt 
                    ? 'bg-primary/30 border-2 border-primary shadow-[0_0_25px_rgba(187,158,255,0.4)] translate-y-[2px] text-primary' 
                    : 'bg-primary/10 border-2 border-primary/50 shadow-[0_0_15px_rgba(187,158,255,0.15)] text-primary'
                }`}>
                ALT
              </button>
              <div className="flex-1 h-10 md:h-12 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <button 
                onClick={() => handleKeyToggle('arrowRight')}
                className={`w-20 h-10 md:h-12 rounded-xl flex items-center justify-center transition-all duration-75 select-none ${
                  !isTyping && keysPressed.arrowRight 
                    ? 'bg-secondary/30 border-2 border-secondary shadow-[0_0_25px_rgba(0,227,253,0.4)] translate-y-[2px] text-secondary' 
                    : 'bg-secondary/10 border-2 border-secondary/50 shadow-[0_0_15px_rgba(0,227,253,0.15)] text-secondary'
                }`}>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}
