import { useState, useEffect } from 'react';
import { Mail, MessageSquare, Code, FileText, Zap, ArrowRight, User } from 'lucide-react';

const SUGGESTIONS = {
  email: "I think we should proceed with the deployment tomorrow...",
  whatsapp: "I've double-checked the latency values and we're good to launch...",
  editor: "Sort the stream by obsidian frequency before returning..."
};

export function Hero() {
  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp' | 'editor'>('email');
  const [keysPressed, setKeysPressed] = useState({
    ctrl: false,
    alt: false,
    arrowRight: false
  });
  const [typedCount, setTypedCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setTypedCount(0);
    setIsTyping(false);
  }, [activeTab]);

  useEffect(() => {
    if (keysPressed.ctrl && keysPressed.alt && keysPressed.arrowRight) {
      if (typedCount === 0 && !isTyping) {
        setIsTyping(true);
      }
    }
  }, [keysPressed.ctrl, keysPressed.alt, keysPressed.arrowRight, typedCount, isTyping]);

  useEffect(() => {
    if (isTyping) {
      const currentFullText = SUGGESTIONS[activeTab];
      if (typedCount < currentFullText.length) {
        const timeout = setTimeout(() => {
          setTypedCount(prev => prev + 1);
        }, 15);
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
      ? "flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary transition-all"
      : "flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-highest text-on-surface-variant transition-all";

  return (
    <section className="relative px-6 pt-12 pb-24 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* Headline Cluster */}
      <div className="z-10 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-on-surface mb-6 leading-[1.1]">
          Intento: Your <span className="text-[#BB9EFF]">AI-powered</span> typing assistant.
        </h1>
        <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed">
          Intento lives on your desktop and helps you write smarter, faster responses wherever your cursor is.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto obsidian-gradient text-on-primary-fixed font-headline font-bold px-10 py-5 rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
            Download for Desktop
          </button>
          <button className="w-full sm:w-auto bg-surface-container-high text-secondary font-headline font-bold px-10 py-5 rounded-xl border border-outline-variant/10 hover:bg-surface-container-highest transition-colors">
            View Demo
          </button>
        </div>
      </div>

      {/* Visual Focus: Interactive HUD & Keyboard */}
      <div className="mt-16 relative w-full max-w-5xl">
        {/* Decorative Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[120px] rounded-full"></div>

        {/* Main Device Mockup Container */}
        <div className="relative bg-surface-container-low rounded-3xl border border-outline-variant/20 p-2 md:p-6 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
          {/* Context Switcher (App Selection) */}
          <div className="flex justify-center gap-3 mb-6">
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
            </div>
          </div>

          {/* Dynamic Application UI & Suggestions */}
          <div className="relative bg-surface-container-lowest rounded-2xl border border-outline-variant/10 p-6 mb-8 text-left min-h-[300px] overflow-hidden group">
            
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
                  <span className="text-on-surface">Subject: Next Steps for the Obsidian Protocol</span>
                  <div className="mt-4">
                    <span className="text-on-surface">Hi Sarah, I've reviewed the latest build. {SUGGESTIONS.email.slice(0, typedCount)}</span>
                    {/* AI Suggestion Overlay (Triggered State) */}
                    <span className="text-primary/50 relative">
                      {SUGGESTIONS.email.slice(typedCount)}
                      <span className="inline-block w-0.5 h-6 bg-secondary align-middle ml-1 animate-blink"></span>
                      {/* Tooltip Trigger Visualization */}
                      {typedCount === 0 && (
                        <div className="absolute -top-14 left-0 glass-panel border border-primary/40 rounded-lg px-4 py-2 shadow-2xl animate-pulse-glow z-20">
                          <div className="flex items-center gap-3">
                            <Zap className="text-primary w-4 h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">ALT</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-secondary/20 border border-secondary/40 text-[10px] text-secondary font-mono font-bold">→</kbd>
                            </div>
                            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Apply</span>
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
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-outline-variant/10">
                  <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">Product Design Team</div>
                    <div className="text-[10px] text-secondary font-label uppercase tracking-widest">online</div>
                  </div>
                </div>
                {/* Chat Bubbles */}
                <div className="space-y-4 max-w-lg">
                  <div className="bg-surface-container-high rounded-2xl rounded-tl-none p-4 text-sm text-on-surface-variant max-w-[85%]">
                    <span className="font-bold text-secondary text-[10px] block mb-1">SARAH</span>
                    Just saw the final obsidian kinetic animations. Are we ready for the 2.0 release tomorrow?
                  </div>
                  {/* User Typing with AI Suggestion */}
                  <div className="ml-auto bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-4 text-sm text-on-surface max-w-[85%] relative">
                    <span className="text-on-surface">Yeah, everything looks solid. {SUGGESTIONS.whatsapp.slice(0, typedCount)}</span>
                    {/* AI Suggestion Overlay */}
                    <span className="text-primary/50 relative">
                      {SUGGESTIONS.whatsapp.slice(typedCount)}
                      <span className="inline-block w-0.5 h-4 bg-secondary align-middle ml-1 animate-blink"></span>
                      {/* Tooltip Trigger Visualization */}
                      {typedCount === 0 && (
                        <div className="absolute -top-12 right-0 glass-panel border border-primary/40 rounded-lg px-4 py-2 shadow-2xl animate-pulse-glow z-20">
                          <div className="flex items-center gap-3">
                            <Zap className="text-primary w-4 h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">ALT</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-secondary/20 border border-secondary/40 text-[10px] text-secondary font-mono font-bold">→</kbd>
                            </div>
                            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest">Apply</span>
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
                  <div className="pl-4 mt-1 flex items-center flex-wrap">
                    <span className="text-on-surface"># {SUGGESTIONS.editor.slice(0, typedCount)}</span>
                    {/* AI Suggestion Overlay (Triggered State) */}
                    <span className={`text-primary/50 relative ${typedCount === 0 ? 'ml-1' : ''}`}>
                      {SUGGESTIONS.editor.slice(typedCount)}
                      <span className="inline-block w-0.5 h-4 bg-secondary align-middle ml-1 animate-blink"></span>
                      {/* Shortcut Tooltip Overlay */}
                      {typedCount === 0 && (
                        <div className="absolute -top-16 left-0 glass-panel border border-primary/40 rounded-lg px-4 py-2 shadow-2xl animate-pulse-glow z-20">
                          <div className="flex items-center gap-3">
                            <Zap className="text-primary w-4 h-4" fill="currentColor" />
                            <div className="flex items-center gap-1">
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">CTRL</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-highest border border-outline-variant text-[10px] text-primary font-mono font-bold">ALT</kbd>
                              <kbd className="px-1.5 py-0.5 rounded bg-secondary/20 border border-secondary/40 text-[10px] text-secondary font-mono font-bold">→</kbd>
                            </div>
                            <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest whitespace-nowrap">Apply Suggestion</span>
                          </div>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </>
            )}

            {/* Scanline Effect for AI Activity */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent h-1/2 w-full -translate-y-full animate-scan pointer-events-none"></div>
          </div>

          {/* Prominent Stylized Dark Keyboard */}
          <div className="bg-[#111111] p-4 md:p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-3 mt-4">
            {/* Row 1 */}
            <div className="flex gap-3">
              <div className="w-12 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] flex items-center justify-center text-[10px] text-white/20">~</div>
              <div className="flex-1 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="w-12 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
            </div>
            
            {/* Row 2 */}
            <div className="flex gap-3">
              <div className="w-20 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="flex-1 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <div className="w-20 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
            </div>
            
            {/* Row 3 */}
            <div className="flex gap-3">
              <button 
                onMouseDown={() => setKeysPressed(p => ({...p, ctrl: true}))}
                onMouseUp={() => setKeysPressed(p => ({...p, ctrl: false}))}
                onMouseLeave={() => setKeysPressed(p => ({...p, ctrl: false}))}
                onTouchStart={() => setKeysPressed(p => ({...p, ctrl: true}))}
                onTouchEnd={() => setKeysPressed(p => ({...p, ctrl: false}))}
                className={`w-24 h-12 md:h-14 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-75 select-none ${
                  keysPressed.ctrl 
                    ? 'bg-primary/30 border-2 border-primary shadow-[0_0_25px_rgba(187,158,255,0.4)] translate-y-[2px] text-primary' 
                    : 'bg-primary/10 border-2 border-primary/50 shadow-[0_0_15px_rgba(187,158,255,0.15)] text-primary'
                }`}>
                CTRL
              </button>
              <button 
                onMouseDown={() => setKeysPressed(p => ({...p, alt: true}))}
                onMouseUp={() => setKeysPressed(p => ({...p, alt: false}))}
                onMouseLeave={() => setKeysPressed(p => ({...p, alt: false}))}
                onTouchStart={() => setKeysPressed(p => ({...p, alt: true}))}
                onTouchEnd={() => setKeysPressed(p => ({...p, alt: false}))}
                className={`w-24 h-12 md:h-14 rounded-xl flex items-center justify-center text-[11px] font-bold font-mono transition-all duration-75 select-none ${
                  keysPressed.alt 
                    ? 'bg-primary/30 border-2 border-primary shadow-[0_0_25px_rgba(187,158,255,0.4)] translate-y-[2px] text-primary' 
                    : 'bg-primary/10 border-2 border-primary/50 shadow-[0_0_15px_rgba(187,158,255,0.15)] text-primary'
                }`}>
                ALT
              </button>
              <div className="flex-1 h-12 md:h-14 rounded-xl bg-[#1A1A1A] border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
              <button 
                onMouseDown={() => setKeysPressed(p => ({...p, arrowRight: true}))}
                onMouseUp={() => setKeysPressed(p => ({...p, arrowRight: false}))}
                onMouseLeave={() => setKeysPressed(p => ({...p, arrowRight: false}))}
                onTouchStart={() => setKeysPressed(p => ({...p, arrowRight: true}))}
                onTouchEnd={() => setKeysPressed(p => ({...p, arrowRight: false}))}
                className={`w-24 h-12 md:h-14 rounded-xl flex items-center justify-center transition-all duration-75 select-none ${
                  keysPressed.arrowRight 
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
  );
}
