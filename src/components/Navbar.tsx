import { Terminal } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e11]/85 backdrop-blur-xl shadow-2xl shadow-[#000000]/40 border-b border-[#48474b]/15">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto gap-4">
        <Link className="flex items-center gap-3" to="/">
          <Terminal className="text-primary w-6 h-6" />
          <span className="text-2xl font-bold tracking-tighter text-on-surface font-headline">Intento</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a className="text-secondary font-medium font-headline transition-colors" href="/#features">
            Features
          </a>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? 'text-on-surface font-headline transition-colors'
                : 'text-on-surface/60 hover:text-on-surface transition-colors font-headline'
            }
            to="/pricing"
          >
            Pricing
          </NavLink>
          <a className="text-on-surface/60 hover:text-on-surface transition-colors font-headline" href="/#security">
            Security
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                className="hidden sm:inline-flex bg-surface-container-high text-on-surface px-4 py-2 rounded-lg font-headline font-bold hover:bg-surface-container-highest transition-all"
                to="/dashboard"
              >
                Dashboard
              </Link>
              <button
                className="bg-primary/15 text-primary px-4 py-2 rounded-lg font-headline font-bold border border-primary/20 hover:bg-primary/20 transition-all active:scale-95 duration-200"
                onClick={handleSignOut}
                type="button"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              className="bg-surface-container-high text-primary px-6 py-2 rounded-lg font-headline font-bold hover:bg-surface-container-highest transition-all active:scale-95 duration-200"
              to="/auth"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
