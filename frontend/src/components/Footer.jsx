import { Link } from 'react-router-dom';

const footerLinks = {
  Product: [
    { to: '/#how-it-works', label: 'How it Works' },
    { to: '/listings', label: 'Browse Listings' },
    { to: '/#safety', label: 'Safety' },
  ],
  Company: [
    { to: '/#about', label: 'About' },
    { to: '#', label: 'Blog' },
    { to: '#', label: 'Contact' },
  ],
  Legal: [
    { to: '#', label: 'Terms' },
    { to: '#', label: 'Privacy' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display font-bold text-xl text-white">Roomify</Link>
            <p className="mt-3 text-sm text-slate-400 max-w-xs">
              Find roommates you'll actually vibe with. Smart matching, trusted listings.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider">{title}</h4>
              <ul className="mt-4 space-y-3">
                {links.map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm hover:text-white transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 text-center">
          © {new Date().getFullYear()} Roomify. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
