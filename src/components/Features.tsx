import { Shield } from 'lucide-react';

export function Features() {
  return (
    <section className="px-6 py-24 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="md:col-span-2 bg-surface-container rounded-2xl p-8 border border-outline-variant/10 relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-4">Contextual Intelligence</h3>
            <p className="text-on-surface-variant max-w-md">Intento understands the thread of your conversation or the flow of your code, providing suggestions that match your tone and goals.</p>
          </div>
          <div className="absolute right-0 bottom-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
        </div>
        {/* Card 2 */}
        <div className="bg-surface-container-high rounded-2xl p-8 border border-outline-variant/10 flex flex-col justify-between">
          <Shield className="text-secondary w-10 h-10 mb-6" />
          <div>
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">Privacy First</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">Local processing means your code and data never leave your device without permission.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
