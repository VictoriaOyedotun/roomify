import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { matchmaking as matchmakingApi } from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';
import ListingCard from '../components/ListingCard';

export default function Recommendations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    matchmakingApi.getRecommendations()
      .then(setList)
      .catch(() => {
        setError('Could not load recommendations.');
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2" />
        <div className="h-4 w-96 bg-slate-100 rounded animate-pulse mb-10" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[4/3] bg-slate-100 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-2"
      >
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
          <Heart className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-950">Your matches</h1>
          <p className="text-slate-600">Listings ranked by compatibility with your quiz answers.</p>
        </div>
      </motion.div>

      {list.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card p-12 text-center max-w-lg mx-auto mt-8"
        >
          <p className="text-slate-600">
            Complete the <Link to="/matchmaking" className="font-medium text-primary-600 hover:text-primary-700">matchmaking quiz</Link> to get personalized recommendations and see your match % for each listing.
          </p>
          <Link to="/matchmaking" className="btn btn-primary mt-6 inline-flex">Take the quiz</Link>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {list.map((rec, i) => (
            <motion.div
              key={rec.listingId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/listings/${rec.listingId}`} className="block card overflow-hidden group hover:shadow-soft-lg transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl">🏠</div>
                <div className="p-5 flex gap-4">
                  <div className="shrink-0">
                    <MatchScoreBadge score={rec.compatibilityScore ?? 0} size="sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-lg mb-2 ${
                      rec.listingType === 'NEED_ROOMMATE' ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {rec.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
                    </span>
                    <h3 className="font-display font-bold text-lg text-slate-950 truncate">{rec.title}</h3>
                    {rec.location && <p className="text-slate-600 text-sm mt-0.5">{rec.location}</p>}
                    {rec.rent != null && <p className="text-primary-600 font-semibold mt-1">${Number(rec.rent).toLocaleString()}/mo</p>}
                    {rec.createdByDisplayName && <p className="text-slate-500 text-xs mt-1">by {rec.createdByDisplayName}</p>}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
