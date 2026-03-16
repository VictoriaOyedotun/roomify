import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { listings as listingsApi, matchmaking as matchmakingApi, chat as chatApi } from '../api/client';
import './ListingDetail.css';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [compatibilityScore, setCompatibilityScore] = useState(null);
  const [compatibilityLoading, setCompatibilityLoading] = useState(false);
  const [compatibilityChecked, setCompatibilityChecked] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [hideIdealBanner, setHideIdealBanner] = useState(false);
  const [searchParams] = useSearchParams();
  const showIdealBanner = isOwner && listing?.listingType === 'NEED_ROOMMATE' && searchParams.get('prompt') === 'ideal' && !hideIdealBanner;

  useEffect(() => {
    listingsApi.getById(id)
      .then(setListing)
      .catch(() => setError('Listing not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const isOwner = isAuthenticated && user?.id === listing?.createdById;

  const handleCheckCompatibility = () => {
    setCompatibilityLoading(true);
    setCompatibilityChecked(true);
    matchmakingApi.getScore(id)
      .then((data) => {
        setCompatibilityScore(data.compatibilityScore ?? null);
      })
      .catch(() => setCompatibilityScore(null))
      .finally(() => setCompatibilityLoading(false));
  };

  const handleMessageOwner = () => {
    setMessageLoading(true);
    chatApi.getOrCreateConversation(id)
      .then((conv) => navigate(`/messages/${conv.id}`))
      .catch((err) => setError(err.message || 'Could not start conversation'))
      .finally(() => setMessageLoading(false));
  };

  if (loading) return <p>Loading...</p>;
  if (error || !listing) return <p>{error || 'Not found'}</p>;

  return (
    <div className="listing-detail">
      {showIdealBanner && (
        <div className="ideal-profile-banner">
          <p>Add an ideal roommate profile to see match % for applicants.</p>
          <Link to={`/matchmaking?listingId=${id}`} className="btn btn-primary btn-sm">Set ideal roommate profile</Link>
          <button type="button" className="banner-dismiss" onClick={() => setHideIdealBanner(true)} aria-label="Dismiss">×</button>
        </div>
      )}
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
      {isAuthenticated && !isOwner && (
        <div className="compatibility-section">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCheckCompatibility}
            disabled={compatibilityLoading}
          >
            {compatibilityLoading ? 'Checking...' : 'Check compatibility'}
          </button>
          {compatibilityChecked && !compatibilityLoading && (
            <p className="compatibility-result">
              {compatibilityScore != null
                ? `You're a ${compatibilityScore}% match with this listing's ideal profile.`
                : "This listing has no ideal profile, or complete the matchmaking quiz first."}
            </p>
          )}
        </div>
      )}
      <div className="actions">
        {isAuthenticated && !isOwner && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleMessageOwner}
            disabled={messageLoading}
          >
            {messageLoading ? 'Opening...' : 'Message owner'}
          </button>
        )}
        {isAuthenticated && isOwner && (
          <Link to={`/listings/${id}/edit`} className="btn btn-secondary">Edit listing</Link>
        )}
        {!isAuthenticated && (
          <Link to="/login" className="btn btn-primary">Log in to contact</Link>
        )}
      </div>
    </div>
  );
}
