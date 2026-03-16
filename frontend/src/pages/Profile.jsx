import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { users as usersApi } from '../api/client';
import './Auth.css';

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
    <div className="auth-page">
      <div className="auth-card">
        <h1>Profile</h1>
        {user && <p className="profile-email">{user.email}</p>}
        {error && <div className="error">{error}</div>}
        {message && <div className="success">{message}</div>}
        <form onSubmit={handleSubmit}>
          <label>
            Display name
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you appear on listings"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
}
