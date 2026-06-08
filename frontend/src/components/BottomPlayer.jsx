import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, ListMusic, Download, Shuffle, Repeat, Loader2 } from 'lucide-react';
import { PlayerContext } from '../contexts/PlayerContext';
import { AuthContext } from '../contexts/AuthContext';
import { downloadSongWithMetadata } from '../utils/download';
import './BottomPlayer.css';

const BottomPlayer = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const { currentSong, isPlaying, progress, duration, volume, togglePlay, seek, changeVolume, setIsNowPlayingOpen } = useContext(PlayerContext);
  const [isDownloading, setIsDownloading] = useState(false);

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  const handleDownloadClick = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (!currentSong || isDownloading) return;
    setIsDownloading(true);
    await downloadSongWithMetadata(currentSong);
    setIsDownloading(false);
  };

  return (
    <div className="bottom-player glass">
      <div className="now-playing">
        {currentSong ? (
          <>
            <div className="song-artwork" style={{backgroundImage: currentSong.coverImage ? `url(${currentSong.coverImage})` : 'none'}}></div>
            <div className="song-info">
              <h4 className="text-sm" style={{margin: 0, fontWeight: 600}}>{currentSong.title}</h4>
              <p className="text-xs text-muted" style={{margin: 0}}>{currentSong.artist}</p>
            </div>
          </>
        ) : (
          <div className="song-info">
            <h4 className="text-sm" style={{margin: 0, fontWeight: 600}}>Select a song</h4>
          </div>
        )}
      </div>

      <div className="player-controls-container">
        <div className="player-buttons">
          <button className="btn-icon"><Shuffle size={18}/></button>
          <button className="btn-icon"><SkipBack size={20}/></button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          <button className="btn-icon"><SkipForward size={20}/></button>
          <button className="btn-icon"><Repeat size={18}/></button>
        </div>
        <div className="progress-container">
          <span className="text-xs text-muted">{formatTime(progress)}</span>
          <div className="progress-bar-bg" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            seek(clickPos * duration);
          }}>
            <div className="progress-bar-fill" style={{width: `${progressPercent}%`}}></div>
            <div className="progress-bar-thumb" style={{left: `${progressPercent}%`}}></div>
          </div>
          <span className="text-xs text-muted">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-options">
        <button className="btn-icon" onClick={handleDownloadClick} title="Download" disabled={isDownloading}>
          {isDownloading ? <Loader2 size={18} className="spin" /> : <Download size={18}/>}
        </button>
        <button className="btn-icon"><ListMusic size={18}/></button>
        <div className="volume-control">
          <Volume2 size={18} className="text-muted" />
          <div className="volume-bar-bg" onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            changeVolume(Math.max(0, Math.min(1, clickPos)));
          }}>
            <div className="volume-bar-fill" style={{width: `${volume * 100}%`}}></div>
          </div>
        </div>
        <button className="btn-icon" onClick={() => {
          if (currentSong) setIsNowPlayingOpen(true);
        }}><Maximize2 size={18}/></button>
      </div>
    </div>
  );
};

export default BottomPlayer;
