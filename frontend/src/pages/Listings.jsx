import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listings as listingsApi } from '../api/client';
import './Listings.css';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'NEED_ROOMMATE', label: 'Rooms for rent' },
  { value: 'LOOKING_FOR_ROOM', label: 'Looking for room' },
];

export default function Listings() {
  const [data, setData] = useState({ content: [], totalElements: 0 });
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
      .then((res) => setData(res))
      .catch(() => setData({ content: [], totalElements: 0 }))
      .finally(() => setLoading(false));
  }, [page, type, location]);

  const totalPages = data.totalPages ?? 0;

  return (
    <div className="listings-page">
      <h1>Browse listings</h1>
      <div className="filters">
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(0); }}>
          {TYPES.map((t) => (
            <option key={t.value || 'all'} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && setPage(0)}
        />
        <button type="button" className="btn btn-primary" onClick={() => setPage(0)}>Apply</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : data.content.length === 0 ? (
        <p>No listings found.</p>
      ) : (
        <>
          <div className="listings-grid">
            {data.content.map((listing) => (
              <Link key={listing.id} to={`/listings/${listing.id}`} className="listing-card">
                <span className={`badge ${listing.listingType}`}>
                  {listing.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
                </span>
                <h3>{listing.title}</h3>
                {listing.location && <p className="location">{listing.location}</p>}
                {listing.rent != null && <p className="rent">${Number(listing.rent).toLocaleString()}/mo</p>}
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span>Page {page + 1} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
