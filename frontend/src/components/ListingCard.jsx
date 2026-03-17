import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';

export default function ListingCard({
  id,
  title,
  location,
  rent,
  availableDate,
  furnished,
  imageUrl,
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      whileHover={{ y: -6 }}
      className="card overflow-hidden group"
    >
      <Link to={id ? `/listings/${id}` : '#'} className="block">
        <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">🏠</div>
          )}
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-slate-950">{title}</h3>
          {location && (
            <p className="flex items-center gap-1.5 text-slate-600 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5" /> {location}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-slate-600 text-sm">
            {rent != null && <span className="font-semibold text-primary-600">${Number(rent).toLocaleString()}/mo</span>}
            {availableDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {availableDate}
              </span>
            )}
            {furnished != null && (
              <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs">{furnished ? 'Furnished' : 'Unfurnished'}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
