import { NavLink } from 'react-router-dom';
import { Home, Compass, TrendingUp, Disc, Mic2, ListMusic, Library, Heart, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar glass">
      <div className="logo-container">
        <img src="/logo.png" alt="Dream Wave Logo" className="logo-icon" />
        <h2>Dream Wave</h2>
      </div>
      
      <div className="nav-section">
        <p className="nav-heading text-xs text-muted">MENU</p>
        <NavLink to="/" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Home size={20}/> Home</NavLink>
        <NavLink to="/discover" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Compass size={20}/> Discover</NavLink>
        <NavLink to="/trending" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><TrendingUp size={20}/> Trending</NavLink>
      </div>

      <div className="nav-section">
        <p className="nav-heading text-xs text-muted">LIBRARY</p>
        <NavLink to="/album/1" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Disc size={20}/> Albums</NavLink>
        <NavLink to="/artist/1" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Mic2 size={20}/> Artists</NavLink>
        <NavLink to="/playlists" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><ListMusic size={20}/> Playlists</NavLink>
        <NavLink to="/local" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Library size={20}/> Local Files</NavLink>
      </div>

      <div className="nav-section">
        <p className="nav-heading text-xs text-muted">GENERAL</p>
        <NavLink to="/favorites" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Heart size={20}/> Favorites</NavLink>
        <NavLink to="/settings" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={20}/> Settings</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
