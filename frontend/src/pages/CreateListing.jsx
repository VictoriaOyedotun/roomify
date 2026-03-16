import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listings as listingsApi } from '../api/client';
import './ListingForm.css';

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
      navigate(`/listings/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create listing');
    }
  };

  return (
    <div className="listing-form-page">
      <h1>Post a listing</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit} className="listing-form">
        <label>
          Type
          <select name="listingType" value={form.listingType} onChange={handleChange} required>
            <option value="NEED_ROOMMATE">I have a room / need a roommate</option>
            <option value="LOOKING_FOR_ROOM">I'm looking for a room</option>
          </select>
        </label>
        <label>
          Title *
          <input name="title" value={form.title} onChange={handleChange} required maxLength={200} placeholder="e.g. Cozy room in downtown" />
        </label>
        <label>
          Description
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the place and what you're looking for." />
        </label>
        <label>
          Location
          <input name="location" value={form.location} onChange={handleChange} placeholder="City, neighborhood, or address" />
        </label>
        <label>
          Rent ($/month)
          <input name="rent" type="number" min="0" step="1" value={form.rent} onChange={handleChange} placeholder="e.g. 1200" />
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
          <textarea name="amenities" value={form.amenities} onChange={handleChange} rows={2} placeholder="e.g. laundry, parking, wifi" />
        </label>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Create listing</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
