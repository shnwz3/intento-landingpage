import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from './components/Footer';
import { Navbar } from './components/Navbar';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';

function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const target = document.getElementById(location.hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.hash, location.pathname]);

  return null;
}

function RouteSkeleton() {
  return (
    <section className="px-6 md:px-8 py-16 max-w-4xl mx-auto">
      <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-low p-10 shadow-[0_24px_48px_-18px_rgba(0,0,0,0.55)]">
        <div className="h-5 w-40 rounded-full bg-surface-container-high animate-pulse mb-6" />
        <div className="h-4 w-full rounded-full bg-surface-container-high animate-pulse mb-3" />
        <div className="h-4 w-4/5 rounded-full bg-surface-container-high animate-pulse mb-10" />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-36 rounded-2xl bg-surface-container animate-pulse" />
          <div className="h-36 rounded-2xl bg-surface-container animate-pulse" />
        </div>
      </div>
    </section>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteSkeleton />;
  }

  if (!user) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate replace to={`/auth?next=${encodeURIComponent(next)}`} />;
  }

  return children;
}

function AppShell() {
  const location = useLocation();
  const isMarketingRoute = location.pathname === '/';

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary/30 min-h-screen flex flex-col">
      <ScrollManager />
      <Navbar />
      <main className={isMarketingRoute ? 'pt-24 flex-grow overflow-x-hidden' : 'pt-24 flex-grow'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/download"
            element={
              <RequireAuth>
                <DashboardPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}
