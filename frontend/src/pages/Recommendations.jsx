import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { matchmaking as matchmakingApi } from '../api/client';
import './Recommendations.css';

export default function Recommendations() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    matchmakingApi.getRecommendations()
      .then(setList)
      .catch(() => {
        setError('Could not load recommendations.');
        setList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your matches...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="recommendations-page">
      <h1>Your matches</h1>
      <p className="intro">Listings ranked by compatibility with your quiz answers.</p>
      {list.length === 0 ? (
        <p>
          Complete the <Link to="/matchmaking">matchmaking quiz</Link> to get personalized recommendations.
        </p>
      ) : (
        <div className="recommendations-list">
          {list.map((rec) => (
            <Link key={rec.listingId} to={`/listings/${rec.listingId}`} className="rec-card">
              <div className="rec-score">
                <span className="score-value">{rec.compatibilityScore}</span>
                <span className="score-label">% match</span>
              </div>
              <div className="rec-content">
                <span className={`badge ${rec.listingType}`}>
                  {rec.listingType === 'NEED_ROOMMATE' ? 'Room available' : 'Looking for room'}
                </span>
                <h3>{rec.title}</h3>
                {rec.location && <p className="location">{rec.location}</p>}
                {rec.rent != null && <p className="rent">${Number(rec.rent).toLocaleString()}/mo</p>}
                {rec.createdByDisplayName && <p className="posted-by">{rec.createdByDisplayName}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
