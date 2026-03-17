import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { users as usersApi } from '../api/client';

export default function Profile() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    usersApi.getMe()
      .then((me) => setDisplayName(me.displayName ?? ''))
      .catch(() => setError('Could not load profile'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      await usersApi.updateMe({ displayName: displayName.trim() || null });
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 md:py-12">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-950">Profile</h1>
          <p className="text-slate-600 text-sm">How you appear on Roomify.</p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="card p-6 md:p-8">
          {user && <p className="text-slate-500 text-sm mb-6">{user.email}</p>}
          {error && <div className="mb-6 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>}
          {message && <div className="mb-6 p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm">{message}</div>}
          <form onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Display name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How you appear on listings"
                className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none"
              />
            </label>
            <button type="submit" className="btn btn-primary mt-6" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
