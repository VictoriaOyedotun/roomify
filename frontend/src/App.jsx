import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import MyListings from './pages/MyListings';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import MatchmakingQuiz from './pages/MatchmakingQuiz';
import Recommendations from './pages/Recommendations';
import Profile from './pages/Profile';
import Messages from './pages/Messages';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="listings" element={<Listings />} />
        <Route path="listings/:id" element={<ListingDetail />} />
        <Route path="my-listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
        <Route path="listings/new" element={<ProtectedRoute><CreateListing /></ProtectedRoute>} />
        <Route path="listings/:id/edit" element={<ProtectedRoute><EditListing /></ProtectedRoute>} />
        <Route path="matchmaking" element={<ProtectedRoute><MatchmakingQuiz /></ProtectedRoute>} />
        <Route path="recommendations" element={<ProtectedRoute><Recommendations /></ProtectedRoute>} />
        <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="messages/:id" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
