import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { PlayerContext } from './contexts/PlayerContext';
import { AuthContext } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import BottomPlayer from './components/BottomPlayer';
import NowPlayingModal from './components/NowPlayingModal';
import Home from './pages/Home';
import Artist from './pages/Artist';
import Album from './pages/Album';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Placeholder from './pages/Placeholder';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppLayout = () => {
  const { isNowPlayingOpen, setIsNowPlayingOpen } = useContext(PlayerContext);
  return (
    <div className="app-container">
      {isNowPlayingOpen && <NowPlayingModal onClose={() => setIsNowPlayingOpen(false)} />}
      <Sidebar />
      <div className="main-view">
        <TopNav />
        <div className="content-area">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/discover" element={<Placeholder title="Discover" />} />
            <Route path="/trending" element={<Placeholder title="Trending" />} />
            <Route path="/playlists" element={<Placeholder title="Playlists" />} />
            <Route path="/local" element={<Placeholder title="Local Files" />} />
            <Route path="/favorites" element={<Placeholder title="Favorites" />} />
            <Route path="/settings" element={<Placeholder title="Settings" />} />
            <Route path="/search" element={<Placeholder title="Search Results" />} />
          </Routes>
        </div>
      </div>
      <BottomPlayer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
