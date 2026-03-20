import { Play, PlayCircle, Volume2, Settings, Maximize, Code, MessageCircle, Send, Mail, Globe } from 'lucide-react';

export function VideoDemo() {
  return (
    <section className="px-6 py-12 md:py-20 max-w-7xl mx-auto flex flex-col items-center">
      <div className="text-center max-w-3xl mb-10">
        <h2 className="text-4xl md:text-5xl font-headline font-bold text-on-surface mb-6">See Intento in Action</h2>
        <p className="text-lg text-on-surface-variant leading-relaxed">
          Watch how Intento seamlessly integrates into your workflow to provide real-time, context-aware suggestions.
        </p>
      </div>

      {/* Video Player */}
      <div className="w-full max-w-5xl relative group">
        <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-outline-variant/20 shadow-[0_0_50px_-12px_rgba(135,76,255,0.3)]">
          {/* Thumbnail/Placeholder */}
          <img
            alt="Intento Interface Demo"
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6Q_ViG-u70M9HnVOtYKDzzoxVMrP5rr0jrd6M9ifeLiglONGeSZkGPQ5r6rRl13Sj3tq0kjXqmo_ZBmX4ujKTMme_tB8dy3xy-o7fTE4fTDy4zCx5GTsNgqp8pLQPpmXJLaoC67ucSEJNmKPjNd6OjwDXP4anMZz5q4EkgiJSbPs3HDnQkVmVXDhkvmb0ElF0gN2vYpyC2wRsb6jCirCklHmqY4uWUS47Ae0NWhMgtMjsCfv-1c-euJ6fv9MRP0-1pszjlOYyF6HV"
            referrerPolicy="no-referrer"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60"></div>

          {/* Play Button */}
          <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full flex items-center justify-center text-primary transition-all hover:scale-110 hover:shadow-[0_0_30px_rgba(187,158,255,0.5)] active:scale-95 group/play">
            <Play className="w-10 h-10 ml-1" fill="currentColor" />
          </button>

          {/* Custom Controls Bar */}
          <div className="absolute bottom-0 w-full p-4 md:p-8 flex flex-col gap-4 bg-gradient-to-t from-background to-transparent">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden relative">
              <div className="absolute top-0 left-0 h-full w-1/3 obsidian-gradient"></div>
            </div>
            {/* UI Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <PlayCircle className="text-on-surface/80 hover:text-primary cursor-pointer w-5 h-5" />
                <Volume2 className="text-on-surface/80 hover:text-primary cursor-pointer w-5 h-5" />
                <span className="text-[11px] font-mono text-on-surface-variant tracking-wider">01:24 / 03:45</span>
              </div>
              <div className="flex items-center gap-6">
                <Settings className="text-on-surface/80 hover:text-primary cursor-pointer w-5 h-5" />
                <Maximize className="text-on-surface/80 hover:text-primary cursor-pointer w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supported Apps Logos */}
      <div className="mt-16 w-full max-w-3xl">
        <p className="text-center text-[10px] font-label font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-8">Seamlessly Compatible With</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale contrast-125">
          <div className="flex items-center gap-2 group cursor-default">
            <Code className="w-6 h-6" />
            <span className="text-xs font-headline font-bold">Coding</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-headline font-bold">Slack</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <Send className="w-6 h-6" />
            <span className="text-xs font-headline font-bold">WhatsApp</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <Mail className="w-6 h-6" />
            <span className="text-xs font-headline font-bold">Gmail</span>
          </div>
          <div className="flex items-center gap-2 group cursor-default">
            <Globe className="w-6 h-6" />
            <span className="text-xs font-headline font-bold">Chrome</span>
          </div>
        </div>
      </div>
    </section>
  );
}
