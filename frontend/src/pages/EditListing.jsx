import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { listings as listingsApi } from '../api/client';

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    rent: '',
    availableDate: '',
    numberOfRoommates: '',
    amenities: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    listingsApi.getById(id)
      .then((l) => {
        setListing(l);
        setForm({
          title: l.title || '',
          description: l.description || '',
          location: l.location || '',
          rent: l.rent != null ? String(l.rent) : '',
          availableDate: l.availableDate || '',
          numberOfRoommates: l.numberOfRoommates != null ? String(l.numberOfRoommates) : '',
          amenities: l.amenities || '',
          status: l.status || 'ACTIVE',
        });
      })
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      rent: form.rent ? Number(form.rent) : null,
      availableDate: form.availableDate || null,
      numberOfRoommates: form.numberOfRoommates ? Number(form.numberOfRoommates) : null,
      amenities: form.amenities.trim() || null,
      status: form.status,
    };
    try {
      await listingsApi.update(id, payload);
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update listing');
    }
  };

  if (loading) return <div className="max-w-2xl mx-auto px-4 py-12 animate-pulse h-64 bg-slate-100 rounded-2xl" />;
  if (error && !listing) return <div className="max-w-xl mx-auto px-4 py-12 text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-2xl text-slate-950">Edit listing</h1>
        <p className="text-slate-600 text-sm mt-1">{listing?.title}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
        <div className="card p-6 md:p-8">
          {error && <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title *</span>
              <input name="title" value={form.title} onChange={handleChange} required maxLength={200} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} className={`mt-1 ${inputClass} resize-none`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input name="location" value={form.location} onChange={handleChange} className={`mt-1 ${inputClass}`} />
            </label>
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Rent ($/month)</span>
                <input name="rent" type="number" min={0} value={form.rent} onChange={handleChange} className={`mt-1 ${inputClass}`} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Available date</span>
                <input name="availableDate" type="date" value={form.availableDate} onChange={handleChange} className={`mt-1 ${inputClass}`} />
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Number of roommates</span>
              <input name="numberOfRoommates" type="number" min={0} value={form.numberOfRoommates} onChange={handleChange} className={`mt-1 ${inputClass}`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Amenities</span>
              <textarea name="amenities" value={form.amenities} onChange={handleChange} rows={2} className={`mt-1 ${inputClass} resize-none`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Status</span>
              <select name="status" value={form.status} onChange={handleChange} className={`mt-1 ${inputClass}`}>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </label>
            {listing?.listingType === 'NEED_ROOMMATE' && (
              <p className="text-slate-600 text-sm">
                <Link to={`/matchmaking?listingId=${id}`} className="text-primary-600 font-medium hover:text-primary-700">Set ideal roommate profile</Link>
                {' '}(optional – listings with a profile show a match % to users who take the quiz).
              </p>
            )}
            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(`/listings/${id}`)}>Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
