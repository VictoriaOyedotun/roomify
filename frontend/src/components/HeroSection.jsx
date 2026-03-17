import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-surface pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-100 shadow-soft text-slate-600 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            Smart compatibility matching
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-slate-950 tracking-tight leading-[1.1]"
          >
            Find a roommate you'll{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600">actually vibe with</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Roomify matches you with compatible roommates based on lifestyle, habits, budget, and living preferences — so you can stop guessing and start connecting.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn btn-primary text-base px-8 py-3.5 shadow-glow hover:shadow-glow">
              Take the Quiz
            </Link>
            <Link to="/listings" className="btn btn-secondary text-base px-8 py-3.5">
              Browse Listings
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-slate-500 text-sm"
          >
            <span className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">10,000+</span> room seekers
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Smart</span> compatibility matching
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Trusted</span> listings
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
