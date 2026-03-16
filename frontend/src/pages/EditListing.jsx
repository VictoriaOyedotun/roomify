import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { listings as listingsApi } from '../api/client';
import './ListingForm.css';

export default function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListingState] = useState(null);
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
      .then((listing) => {
        setListingState(listing);
        setForm({
          title: listing.title || '',
          description: listing.description || '',
          location: listing.location || '',
          rent: listing.rent != null ? String(listing.rent) : '',
          availableDate: listing.availableDate || '',
          numberOfRoommates: listing.numberOfRoommates != null ? String(listing.numberOfRoommates) : '',
          amenities: listing.amenities || '',
          status: listing.status || 'ACTIVE',
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="listing-form-page">
      <h1>Edit listing</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="listing-form">
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} required maxLength={200} />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} />
        </label>
        <label>
          Rent ($/month)
          <input name="rent" type="number" min="0" step="1" value={form.rent} onChange={handleChange} />
        </label>
        <label>
          Available date
          <input name="availableDate" type="date" value={form.availableDate} onChange={handleChange} />
        </label>
        <label>
          Number of roommates
          <input name="numberOfRoommates" type="number" min="0" value={form.numberOfRoommates} onChange={handleChange} />
        </label>
        <label>
          Amenities
          <textarea name="amenities" value={form.amenities} onChange={handleChange} rows={2} />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </label>
        {listing?.listingType === 'NEED_ROOMMATE' && (
          <p className="ideal-profile-link">
            <Link to={`/matchmaking?listingId=${id}`}>Set ideal roommate profile</Link> (same quiz) to get better matches.
          </p>
        )}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/listings/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
