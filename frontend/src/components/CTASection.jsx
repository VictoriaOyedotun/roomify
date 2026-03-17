import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function CTASection({ headline = "Your next home starts with the right roommate.", buttonText = "Get Started Free", buttonTo = "/register" }) {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)]" />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white tracking-tight">
              {headline}
            </h2>
            <Link
              to={buttonTo}
              className="mt-8 inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-primary-600 font-semibold shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all"
            >
              {buttonText}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
