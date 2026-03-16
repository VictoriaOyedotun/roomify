import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">ROOMIFY</Link>
        <nav>
          <Link to="/listings">Browse</Link>
          {isAuthenticated ? (
            <>
              <Link to="/matchmaking">Matchmaking</Link>
              <Link to="/recommendations">My Matches</Link>
              <Link to="/my-listings">My Listings</Link>
              <Link to="/listings/new">Post Listing</Link>
              <Link to="/profile">Profile</Link>
              <button type="button" className="btn-link" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login">Log in</Link>
              <Link to="/register">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
