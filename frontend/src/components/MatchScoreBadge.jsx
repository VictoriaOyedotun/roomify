import { motion } from 'framer-motion';

export default function MatchScoreBadge({ score, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'w-12 h-12 text-sm' : size === 'lg' ? 'w-20 h-20 text-xl' : 'w-14 h-14 text-base';
  const ringColor = score >= 80 ? 'border-primary-400' : score >= 60 ? 'border-primary-300' : 'border-slate-200';
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`rounded-full border-4 ${ringColor} flex items-center justify-center font-display font-bold text-slate-950 bg-white shadow-soft ${sizeClasses}`}
    >
      {score}%
    </motion.div>
  );
}
