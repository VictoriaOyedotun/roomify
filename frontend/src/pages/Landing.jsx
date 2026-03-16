import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing">
      <section className="hero">
        <h1>Find Your Perfect Roommate</h1>
        <p>Browse rooms and listings, take the matchmaking quiz, and get personalized recommendations.</p>
        {!isAuthenticated ? (
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">Get started</Link>
            <Link to="/login" className="btn btn-secondary">Log in</Link>
          </div>
        ) : (
          <div className="hero-actions">
            <Link to="/listings" className="btn btn-primary">Browse listings</Link>
            <Link to="/matchmaking" className="btn btn-secondary">Take the quiz</Link>
          </div>
        )}
      </section>
      <section className="features">
        <div className="feature">
          <h3>Browse</h3>
          <p>View rooms for rent and people looking for roommates.</p>
        </div>
        <div className="feature">
          <h3>Post</h3>
          <p>List your room or say you're looking for a place.</p>
        </div>
        <div className="feature">
          <h3>Match</h3>
          <p>Answer a short quiz and get compatibility-based recommendations.</p>
        </div>
      </section>
    </div>
  );
}
