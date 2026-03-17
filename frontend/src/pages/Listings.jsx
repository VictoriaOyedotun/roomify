import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { listings as listingsApi } from '../api/client';
import ListingCard from '../components/ListingCard';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'NEED_ROOMMATE', label: 'Rooms for rent' },
  { value: 'LOOKING_FOR_ROOM', label: 'Looking for room' },
];

export default function Listings() {
  const [data, setData] = useState({ content: [], totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const size = 12;

  useEffect(() => {
    setLoading(true);
    const params = { page, size };
    if (type) params.type = type;
    if (location) params.location = location;
    listingsApi.list(params)
      .then((res) => setData({ content: res.content ?? [], totalPages: res.totalPages ?? 0 }))
      .catch(() => setData({ content: [], totalPages: 0 }))
      .finally(() => setLoading(false));
  }, [page, type, location]);

  const totalPages = data.totalPages;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-950">Browse listings</h1>
        <p className="text-slate-600 mt-1">Find rooms and roommates that fit.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 mb-10 p-4 rounded-2xl bg-white border border-slate-100 shadow-soft"
      >
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(0); }}
          className="px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
        >
          {TYPES.map((t) => (
            <option key={t.value || 'all'} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setPage(0)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
          />
        </div>
        <button type="button" className="btn btn-primary flex items-center gap-2" onClick={() => setPage(0)}>
          <Search className="w-4 h-4" /> Apply
        </button>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : data.content.length === 0 ? (
        <div className="card p-12 text-center text-slate-600">
          No listings found. Try different filters or <Link to="/listings/new" className="text-primary-600 font-medium">post a listing</Link>.
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.content.map((listing, i) => (
              <ListingCard
                key={listing.id}
                id={listing.id}
                title={listing.title}
                location={listing.location}
                rent={listing.rent}
                availableDate={listing.availableDate}
                delay={i * 0.03}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <button
                type="button"
                className="btn btn-secondary"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span className="text-slate-600 text-sm">Page {page + 1} of {totalPages}</span>
              <button
                type="button"
                className="btn btn-secondary"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
