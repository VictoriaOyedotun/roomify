import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -4 }}
      className="card p-8 h-full flex flex-col"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-primary-600 mb-6">
        {Icon && <Icon className="w-7 h-7" />}
      </div>
      <h3 className="font-display font-bold text-xl text-slate-950">{title}</h3>
      <p className="text-slate-600 mt-2 flex-1">{description}</p>
    </motion.div>
  );
}
