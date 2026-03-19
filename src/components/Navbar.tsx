import { Terminal } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e11]/80 backdrop-blur-xl shadow-2xl shadow-[#000000]/40 border-b border-[#48474b]/15">
      <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Terminal className="text-primary w-6 h-6" />
          <span className="text-2xl font-bold tracking-tighter text-on-surface font-headline">Intento</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-secondary font-medium font-headline transition-colors" href="#">Features</a>
          <a className="text-on-surface/60 hover:text-on-surface transition-colors font-headline" href="#">Pricing</a>
          <a className="text-on-surface/60 hover:text-on-surface transition-colors font-headline" href="#">Security</a>
        </div>
        <button className="bg-surface-container-high text-primary px-6 py-2 rounded-lg font-headline font-bold hover:bg-surface-container-highest transition-all active:scale-95 duration-200">
          Log In
        </button>
      </div>
    </nav>
  );
}
