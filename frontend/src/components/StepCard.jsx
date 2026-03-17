import { motion } from 'framer-motion';

export default function StepCard({ step, title, description, icon: Icon, delay = 0, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative flex flex-col items-center text-center"
    >
      {!isLast && (
        <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary-200 to-transparent" />
      )}
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-soft mb-4">
        {Icon ? <Icon className="w-10 h-10" /> : <span className="font-display font-bold text-2xl">{step}</span>}
      </div>
      <h3 className="font-display font-bold text-lg text-slate-950">{title}</h3>
      <p className="text-slate-600 text-sm mt-1 max-w-xs">{description}</p>
    </motion.div>
  );
}
