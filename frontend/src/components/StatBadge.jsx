import { motion } from 'framer-motion';

export default function StatBadge({ value, label, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="inline-flex flex-col items-center rounded-2xl bg-white px-6 py-4 shadow-soft border border-slate-100"
    >
      <span className="font-display font-bold text-2xl text-primary-600">{value}</span>
      <span className="text-slate-600 text-sm mt-0.5">{label}</span>
    </motion.div>
  );
}
