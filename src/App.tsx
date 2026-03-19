import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VideoDemo } from './components/VideoDemo';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <Navbar />
      <main className="pt-24 flex-grow overflow-x-hidden">
        <Hero />
        <VideoDemo />
      </main>
      <Footer />
    </div>
  );
}

