import { Terminal, Code } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background w-full border-t border-outline-variant/15">
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-8 py-12 space-y-6 md:space-y-0 max-w-7xl mx-auto">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-on-surface font-bold font-headline text-xl tracking-tighter">Intento</span>
          <span className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40">© 2026 Intento, Intent to you.</span>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8">
          <a className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors" href="#">Features</a>
          <a className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors" href="#">Pricing</a>
          <a className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors" href="#">Download</a>
          <a className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors" href="#">Privacy</a>
          <a className="font-headline text-[11px] uppercase tracking-[0.05em] text-on-surface/40 hover:text-primary transition-colors" href="#">Terms</a>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
            <Code className="w-4 h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
