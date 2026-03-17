import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navLinks = [
  { to: '/recommendations', label: 'Find Roommates' },
  { to: '/listings', label: 'Browse Rooms' },
  { to: '/#how-it-works', label: 'How it Works' },
  { to: '/#safety', label: 'Safety' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">
            Roomify
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="text-slate-600 hover:text-slate-950 font-medium transition-colors"
            >
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-slate-600 hover:text-slate-950 font-medium">
                Dashboard
              </Link>
              <Link to="/recommendations" className="text-slate-600 hover:text-slate-950 font-medium">
                My Matches
              </Link>
              <Link to="/messages" className="text-slate-600 hover:text-slate-950 font-medium">
                Messages
              </Link>
              <Link to="/profile" className="text-slate-600 hover:text-slate-950 font-medium">
                Profile
              </Link>
              <button type="button" className="btn btn-secondary text-sm" onClick={logout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-slate-950 font-medium">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary text-sm">
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu onClose={() => setMobileOpen(false)} isAuthenticated={isAuthenticated} logout={logout} />
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileMenu({ onClose, isAuthenticated, logout }) {
  const links = [
    ...navLinks,
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }, { to: '/recommendations', label: 'My Matches' }, { to: '/messages', label: 'Messages' }, { to: '/profile', label: 'Profile' }] : []),
  ];
  const handleLogout = () => { logout(); onClose(); };
  return (
    <motion.div
      initial={{ opacity: 0, x: '100%' }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: '100%' }}
      transition={{ type: 'tween', duration: 0.2 }}
      className="fixed inset-0 z-50 md:hidden"
    >
      <div className="absolute inset-0 bg-slate-950/20" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-soft-lg p-6 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <span className="font-display font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">Roomify</span>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100" aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={onClose} className="py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button type="button" onClick={handleLogout} className="btn btn-secondary mt-4">Log out</button>
          ) : (
            <>
              <Link to="/login" onClick={onClose} className="py-3 px-4 rounded-xl text-slate-700 hover:bg-slate-50 font-medium">Log in</Link>
              <Link to="/register" onClick={onClose} className="btn btn-primary mt-4">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
