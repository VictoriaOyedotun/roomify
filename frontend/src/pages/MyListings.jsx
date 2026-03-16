import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listings as listingsApi } from '../api/client';
import './Listings.css';

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
    <div className="listings-page">
      <h1>My listings</h1>
      <Link to="/listings/new" className="btn btn-primary" style={{ marginBottom: '1rem' }}>Post a new listing</Link>
      {loading ? (
        <p>Loading...</p>
      ) : list.length === 0 ? (
        <p>You have no listings yet. <Link to="/listings/new">Post one</Link>.</p>
      ) : (
        <div className="listings-grid">
          {list.map((listing) => (
            <div key={listing.id} className="listing-card" style={{ display: 'block' }}>
              <span className={`badge ${listing.listingType}`}>
                {listing.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
              </span>
              <h3>{listing.title}</h3>
              {listing.location && <p className="location">{listing.location}</p>}
              {listing.rent != null && <p className="rent">${Number(listing.rent).toLocaleString()}/mo</p>}
              <p className="status">Status: {listing.status}</p>
              <Link to={`/listings/${listing.id}/edit`} className="btn btn-secondary" style={{ marginTop: '0.5rem', display: 'inline-block' }}>Edit</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
