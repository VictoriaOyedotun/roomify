import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import { listings as listingsApi } from '../api/client';

const inputClass = 'w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition';

export default function CreateListing() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    listingType: 'NEED_ROOMMATE',
    title: '',
    description: '',
    location: '',
    rent: '',
    availableDate: '',
    numberOfRoommates: '',
    amenities: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = {
      listingType: form.listingType,
      title: form.title.trim(),
      description: form.description.trim() || null,
      location: form.location.trim() || null,
      rent: form.rent ? Number(form.rent) : null,
      availableDate: form.availableDate || null,
      numberOfRoommates: form.numberOfRoommates ? Number(form.numberOfRoommates) : null,
      amenities: form.amenities.trim() || null,
    };
    try {
      const created = await listingsApi.create(payload);
      navigate(`/listings/${created.id}?prompt=ideal`);
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600">
          <Home className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-950">Post a listing</h1>
          <p className="text-slate-600 text-sm">Share your room or find a place.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="card p-6 md:p-8">
          {error && <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Type</span>
              <select name="listingType" value={form.listingType} onChange={handleChange} required className={`mt-1 ${inputClass}`}>
                <option value="NEED_ROOMMATE">I have a room / need a roommate</option>
                <option value="LOOKING_FOR_ROOM">I'm looking for a room</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Title *</span>
              <input name="title" value={form.title} onChange={handleChange} required maxLength={200} placeholder="e.g. Cozy room in downtown" className={`mt-1 ${inputClass}`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Description</span>
              <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the place and what you're looking for." className={`mt-1 ${inputClass} resize-none`} />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Location</span>
              <input name="location" value={form.location} onChange={handleChange} placeholder="City, neighborhood, or address" className={`mt-1 ${inputClass}`} />
            </label>
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Rent ($/month)</span>
                <input name="rent" type="number" min={0} step={1} value={form.rent} onChange={handleChange} placeholder="e.g. 1200" className={`mt-1 ${inputClass}`} />
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
              <textarea name="amenities" value={form.amenities} onChange={handleChange} rows={2} placeholder="e.g. laundry, parking, wifi" className={`mt-1 ${inputClass} resize-none`} />
            </label>
            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn btn-primary">Create listing</button>
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
