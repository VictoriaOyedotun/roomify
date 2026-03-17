import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from 'lucide-react';
import MatchScoreBadge from './MatchScoreBadge';

export default function RoommateCard({
  id,
  name,
  age,
  city,
  matchScore,
  bio,
  tags = [],
  budget,
  moveInDate,
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
        <div className="aspect-[4/5] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-display font-bold">
              {name?.charAt(0) || '?'}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <MatchScoreBadge score={matchScore ?? 0} size="sm" />
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-display font-bold text-lg text-slate-950">
            {name}{age != null && `, ${age}`}
          </h3>
          {city && (
            <p className="flex items-center gap-1.5 text-slate-600 text-sm mt-0.5">
              <MapPin className="w-3.5 h-3.5" /> {city}
            </p>
          )}
          {bio && <p className="text-slate-600 text-sm mt-2 line-clamp-2">{bio}</p>}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tags.slice(0, 4).map((tag) => (
                <span key={tag} className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
          {(budget || moveInDate) && (
            <div className="flex items-center gap-3 mt-3 text-slate-500 text-xs">
              {budget && <span>${budget}/mo</span>}
              {moveInDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {moveInDate}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
