import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Download, Loader2 } from 'lucide-react';
import { PlayerContext } from '../contexts/PlayerContext';
import { AuthContext } from '../contexts/AuthContext';
import { downloadSongWithMetadata } from '../utils/download';
import './NowPlayingModal.css';

const NowPlayingModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { currentSong, isPlaying, progress, duration, togglePlay, seek } = useContext(PlayerContext);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!currentSong) return null;

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  const handleDownloadClick = async () => {
    if (!token) {
      onClose(); // close modal
      navigate('/login');
      return;
    }
    if (!currentSong || isDownloading) return;
    setIsDownloading(true);
    await downloadSongWithMetadata(currentSong);
    setIsDownloading(false);
  };

  return (
    <div className="now-playing-overlay">
      <button className="now-playing-close" onClick={onClose}>
        <X size={28} />
      </button>

      <div className="now-playing-content">
        <div 
          className="now-playing-art" 
          style={{ backgroundImage: currentSong.coverImage ? `url(${currentSong.coverImage})` : 'none', backgroundColor: '#333' }}
        ></div>

        <div className="now-playing-info">
          <h2 className="now-playing-title">{currentSong.title}</h2>
          <p className="now-playing-artist">{currentSong.artist}</p>
        </div>

        <div className="now-playing-controls">
          <div className="np-progress-container">
            <span className="text-xs text-muted">{formatTime(progress)}</span>
            <div className="np-progress-bg" onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickPos = (e.clientX - rect.left) / rect.width;
              seek(clickPos * duration);
            }}>
              <div className="np-progress-fill" style={{ width: `${progressPercent}%` }}></div>
              <div className="np-progress-thumb" style={{ left: `${progressPercent}%` }}></div>
            </div>
            <span className="text-xs text-muted">{formatTime(duration)}</span>
          </div>

          <div className="np-buttons">
            <button className="np-btn" onClick={handleDownloadClick} title="Download Song" disabled={isDownloading}>
              {isDownloading ? <Loader2 size={24} className="spin" /> : <Download size={24} />}
            </button>
            <button className="np-btn"><SkipBack size={32} fill="currentColor" /></button>
            <button className="np-play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />}
            </button>
            <button className="np-btn"><SkipForward size={32} fill="currentColor" /></button>
            <button className="np-btn"><Repeat size={24} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NowPlayingModal;
