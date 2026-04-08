import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Navbar() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  async function handleSignOut() {
    try {
      await signOut();
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e11]/85 backdrop-blur-xl shadow-2xl shadow-[#000000]/40 border-b border-[#48474b]/15">
      <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto ">
        <Link className="flex items-center gap-2" to="/">
          <img
            src="/png.png"
            alt="Intento logo"
            className="w-11 h-10 rounded-md object-contain"
          />
          <span className="text-2xl font-bold tracking-tighter text-on-surface font-headline">
            Intento
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            className="text-secondary font-medium font-headline transition-colors"
            to="/#features"
          >
            Features
          </Link>

          <Link
            className="text-on-surface/60 hover:text-on-surface transition-colors font-headline"
            to="/#security"
          >
            Security
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
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
