import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, Bell, Edit, LogOut, Disc } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import UploadModal from './UploadModal';
import UploadAlbumModal from './UploadAlbumModal';
import ProfileModal from './ProfileModal';
import './TopNav.css';

const TopNav = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadAlbumModal, setShowUploadAlbumModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <div className="top-nav glass">
        <form className="search-bar" onSubmit={handleSearch}>
          <Search size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder="Search for artists, songs, or albums" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="nav-actions">
          <div style={{display: 'flex', gap: '10px'}}>
            <button 
              className="btn btn-primary upload-btn" 
              onClick={() => token ? setShowUploadModal(true) : navigate('/login')}
              style={{padding: '8px 15px'}}
            >
              <Upload size={16} style={{marginRight: '8px'}}/> Track
            </button>
            <button 
              className="btn btn-secondary upload-btn" 
              onClick={() => token ? setShowUploadAlbumModal(true) : navigate('/login')}
              style={{padding: '8px 15px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)'}}
            >
              <Disc size={16} style={{marginRight: '8px'}}/> Album
            </button>
          </div>
          
          {token ? (
            <>
              <button className="btn-icon">
                <Bell size={20} />
              </button>
              <div className="user-profile-actions" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                <div className="user-avatar" style={{background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold'}}>
                  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                </div>
                <button className="btn-icon" onClick={() => setShowProfileModal(true)} title="Edit Profile">
                  <Edit size={20} />
                </button>
                <button className="btn-icon" onClick={() => { logout(); navigate('/login'); }} title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/login')} style={{marginLeft: '10px'}}>
              Log In
            </button>
          )}
        </div>
      </div>

      {showUploadModal && <UploadModal onClose={() => setShowUploadModal(false)} />}
      {showUploadAlbumModal && <UploadAlbumModal onClose={() => setShowUploadAlbumModal(false)} />}
      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </>
  );
};

export default TopNav;
