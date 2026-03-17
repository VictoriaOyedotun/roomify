import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, X, MessageCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { listings as listingsApi, matchmaking as matchmakingApi, chat as chatApi } from '../api/client';
import MatchScoreBadge from '../components/MatchScoreBadge';

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
      .then((data) => setCompatibilityScore(data.compatibilityScore ?? null))
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

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 bg-slate-200 rounded" />
          <div className="h-10 w-3/4 bg-slate-100 rounded" />
          <div className="aspect-video bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }
  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 text-center">
        <p className="text-red-600">{error || 'Not found'}</p>
        <Link to="/listings" className="btn btn-secondary mt-4 inline-flex">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
      {showIdealBanner && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-2xl bg-primary-50 border border-primary-100 p-5 mb-8"
        >
          <p className="text-slate-800 pr-8">Add an ideal roommate profile to see match % for applicants.</p>
          <div className="flex gap-3 mt-4">
            <Link to={`/matchmaking?listingId=${id}`} className="btn btn-primary text-sm py-2">
              Set ideal roommate profile
            </Link>
          </div>
          <button type="button" className="absolute top-4 right-4 p-1 rounded-lg hover:bg-primary-100 text-slate-500" onClick={() => setHideIdealBanner(true)} aria-label="Dismiss">
            <X className="w-5 h-5" />
          </button>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className={`inline-block text-sm font-medium px-3 py-1 rounded-xl mb-4 ${
          listing.listingType === 'NEED_ROOMMATE' ? 'bg-primary-100 text-primary-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
          {listing.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
        </span>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-slate-950">{listing.title}</h1>
        <div className="flex flex-wrap gap-4 mt-4 text-slate-600">
          {listing.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {listing.location}
            </span>
          )}
          {listing.rent != null && (
            <span className="font-semibold text-primary-600">${Number(listing.rent).toLocaleString()}/mo</span>
          )}
          {listing.availableDate && (
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Available {listing.availableDate}
            </span>
          )}
          {listing.numberOfRoommates != null && (
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {listing.numberOfRoommates} roommates
            </span>
          )}
        </div>
        {listing.createdByDisplayName && (
          <p className="text-slate-500 text-sm mt-2">Posted by {listing.createdByDisplayName}</p>
        )}

        {listing.description && (
          <div className="mt-8">
            <h2 className="font-display font-bold text-lg text-slate-950 mb-2">Description</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{listing.description}</p>
          </div>
        )}
        {listing.amenities && (
          <div className="mt-6">
            <h2 className="font-display font-bold text-lg text-slate-950 mb-2">Amenities</h2>
            <p className="text-slate-600 whitespace-pre-wrap">{listing.amenities}</p>
          </div>
        )}

        {isAuthenticated && !isOwner && (
          <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-slate-700 font-medium mb-3">
              <Sparkles className="w-4 h-4 text-primary-500" /> Check compatibility
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCheckCompatibility}
              disabled={compatibilityLoading}
            >
              {compatibilityLoading ? 'Checking...' : 'Check compatibility'}
            </button>
            {compatibilityChecked && !compatibilityLoading && (
              <p className="mt-3 text-slate-600">
                {compatibilityScore != null
                  ? <>You're a <strong>{compatibilityScore}%</strong> match with this listing's ideal profile.</>
                  : "This listing has no ideal profile, or complete the matchmaking quiz first."}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-10">
          {isAuthenticated && !isOwner && (
            <button
              type="button"
              className="btn btn-primary flex items-center gap-2"
              onClick={handleMessageOwner}
              disabled={messageLoading}
            >
              <MessageCircle className="w-4 h-4" /> {messageLoading ? 'Opening...' : 'Message owner'}
            </button>
          )}
          {isAuthenticated && isOwner && (
            <Link to={`/listings/${id}/edit`} className="btn btn-secondary">Edit listing</Link>
          )}
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-primary">Log in to contact</Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
