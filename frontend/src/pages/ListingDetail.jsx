import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listings as listingsApi } from '../api/client';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    listingsApi.getById(id)
      .then(setListing)
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error || !listing) return <p>{error || 'Not found'}</p>;

  const isOwner = isAuthenticated && listing.createdById; // would need current user id to compare

  return (
    <div className="listing-detail">
      <span className={`badge ${listing.listingType}`}>
        {listing.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
      </span>
      <h1>{listing.title}</h1>
      {listing.location && <p className="location">{listing.location}</p>}
      {listing.rent != null && <p className="rent">${Number(listing.rent).toLocaleString()}/mo</p>}
      {listing.availableDate && <p>Available: {listing.availableDate}</p>}
      {listing.numberOfRoommates != null && <p>Roommates: {listing.numberOfRoommates}</p>}
      {listing.description && (
        <div className="description">
          <h2>Description</h2>
          <p>{listing.description}</p>
        </div>
      )}
      {listing.amenities && (
        <div className="amenities">
          <h2>Amenities</h2>
          <p>{listing.amenities}</p>
        </div>
      )}
      {listing.createdByDisplayName && (
        <p className="posted-by">Posted by {listing.createdByDisplayName}</p>
      )}
      <div className="actions">
        {isAuthenticated && (
          <span className="contact-cta">Contact placeholder – messaging coming soon.</span>
        )}
        {!isAuthenticated && (
          <Link to="/login" className="btn btn-primary">Log in to contact</Link>
        )}
      </div>
    </div>
  );
}
