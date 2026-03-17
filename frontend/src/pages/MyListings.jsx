import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, Plus } from 'lucide-react';
import { listings as listingsApi } from '../api/client';

export default function MyListings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listingsApi.myListings()
      .then(setList)
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-950">My listings</h1>
            <p className="text-slate-600 text-sm">Manage your rooms and posts.</p>
          </div>
        </div>
        <Link to="/listings/new" className="btn btn-primary flex items-center gap-2 shrink-0">
          <Plus className="w-4 h-4" /> Post a new listing
        </Link>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-slate-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-slate-200 rounded" />
                <div className="h-4 w-1/2 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-slate-600">You have no listings yet.</p>
          <Link to="/listings/new" className="btn btn-primary mt-6 inline-flex">Post one</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-4xl">🏠</div>
              <div className="p-5">
                <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-lg mb-2 ${
                  listing.listingType === 'NEED_ROOMMATE' ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {listing.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-950">{listing.title}</h3>
                {listing.location && <p className="text-slate-600 text-sm mt-0.5">{listing.location}</p>}
                {listing.rent != null && <p className="text-primary-600 font-semibold mt-1">${Number(listing.rent).toLocaleString()}/mo</p>}
                <p className="text-slate-500 text-xs mt-2">Status: {listing.status}</p>
                <div className="flex gap-3 mt-4">
                  <Link to={`/listings/${listing.id}`} className="btn btn-secondary text-sm">View</Link>
                  <Link to={`/listings/${listing.id}/edit`} className="btn btn-primary text-sm">Edit</Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
