import { useState, useEffect, useContext } from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../contexts/PlayerContext';
import './Home.css';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const { playSong } = useContext(PlayerContext);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('/api/songs');
        setSongs(res.data);
      } catch (err) {
        console.error("Error fetching songs:", err);
      }
    };
    fetchSongs();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section glass">
        <div className="hero-content">
          <h1 className="text-2xl">G.O.A.T.</h1>
          <p className="text-muted" style={{marginBottom: '24px'}}>Diljit Dosanjh • Greatest of All Time</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => songs.length > 0 && playSong(songs[0])}>Play Now</button>
            <button className="btn glass" style={{color: 'white'}}>Explore</button>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="category-section">
        <div className="section-header">
          <h2 className="text-xl">Trending Songs</h2>
          <a href="#" className="text-sm text-muted">See all</a>
        </div>
        <div className="card-carousel">
          {Array.isArray(songs) && songs.length > 0 ? songs.map((song, i) => (
            <div key={i} className="song-card glass">
              <div className="card-image-container">
                <div className="card-image bg-gradient-purple" style={{backgroundImage: song.coverImage ? `url(${song.coverImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
                <button className="play-overlay btn-primary" onClick={() => playSong(song)}>
                  <Play size={20} fill="currentColor" />
                </button>
              </div>
              <h4 className="text-sm" style={{marginTop: '12px'}}>{song.title}</h4>
              <p className="text-xs text-muted">{song.artist}</p>
            </div>
          )) : (
            <p className="text-muted text-sm">Waiting for database connection...</p>
          )}
        </div>
      </section>

      {/* End of Content */}
    </div>
  );
};

export default Home;
