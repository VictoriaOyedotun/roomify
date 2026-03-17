import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageCircle, LayoutGrid, ClipboardList, ChevronRight } from 'lucide-react';

const quickLinks = [
  { to: '/recommendations', label: 'My Matches', icon: Heart, description: 'See compatible roommates and listings' },
  { to: '/listings', label: 'Browse Listings', icon: LayoutGrid, description: 'Find rooms and roommates' },
  { to: '/messages', label: 'Messages', icon: MessageCircle, description: 'Your conversations' },
  { to: '/matchmaking', label: 'Compatibility Quiz', icon: ClipboardList, description: 'Improve your match results' },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-950">
          Hey{user?.displayName ? `, ${user.displayName}` : ''} 👋
        </h1>
        <p className="text-slate-600 mt-1">Here's your Roomify home base.</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {quickLinks.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              to={item.to}
              className="flex items-center gap-4 card p-6 hover:shadow-soft-lg transition-shadow group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                <item.icon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display font-bold text-lg text-slate-950 group-hover:text-primary-600 transition-colors">{item.label}</h2>
                <p className="text-slate-600 text-sm mt-0.5">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary-500 shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
