import { Download, Monitor, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { SetupNotice } from "../components/SetupNotice";

const DOWNLOAD_URL = import.meta.env.VITE_DOWNLOAD_URL;

export function DashboardPage() {
  const { configured, user } = useAuth();

  return (
    <section className="px-6 md:px-8 py-10 md:py-16 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-center">
      {!configured ? (
        <div className="mb-8 w-full">
          <SetupNotice
            body="Follow the guide in README.md to configure your Supabase environment variables."
            title="Setup required"
          />
        </div>
      ) : null}

      {/* Hero Welcome Section */}
      <div className="flex flex-col md:flex-row gap-12 items-center justify-between mb-16 relative">
        {/* Glow effect behind */}
        <div className="absolute -z-10 top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex-1 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-label uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Account Verified</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-on-surface mb-6 leading-tight">
            Welcome aboard
            {user?.user_metadata?.full_name
              ? `, ${user.user_metadata.full_name}`
              : ""}
            .<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              You're ready to launch.
            </span>
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed mb-10">
            Intento runs entirely locally on your machine for zero latency and
            absolute privacy. Your web account is secure; now it's time to
            download the desktop application.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={DOWNLOAD_URL}
              download="Intento.Setup.Latest.exe"
              className="flex items-center justify-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-full font-headline font-semibold hover:scale-105 hover:bg-primary/90 transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.5)]"
            >
              <Download className="w-5 h-5" />
              Download for Windows
            </a>
            <button
              aria-disabled="true"
              className="flex items-center justify-center gap-3 bg-surface-container-high border border-outline-variant/30 text-on-surface px-8 py-4 rounded-full font-headline font-semibold hover:bg-surface-container-highest transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:active:scale-100"
              disabled
              title="Coming soon"
            >
              <Download className="w-5 h-5" />
              Download for macOS
            </button>
          </div>
          <p className="text-xs text-on-surface/40 mt-5 font-medium tracking-wide">Version 1.0.0 • Approx 45MB • Requires Windows 11 / macOS 12+</p>
        </div>

        {/* Visual Showcase */}
        <div className="flex-1 hidden md:flex justify-end relative">
          <div className="relative w-[400px] h-[300px]">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-[2rem] transform rotate-6 border border-outline-variant/10 backdrop-blur-3xl shadow-2xl" />
            <div className="absolute inset-0 bg-surface-container-low rounded-[2rem] transform -rotate-3 border border-outline-variant/20 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
              <div className="h-10 bg-surface-container-high border-b border-outline-variant/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-error/80" />
                <div className="w-3 h-3 rounded-full bg-secondary/80" />
                <div className="w-3 h-3 rounded-full bg-primary/80" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <Monitor className="w-16 h-16 text-primary mb-4 opacity-80" />
                <h3 className="font-headline font-bold text-lg mb-2">Desktop Environment</h3>
                <p className="text-xs text-on-surface-variant opacity-70">Running deep local integrations.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
