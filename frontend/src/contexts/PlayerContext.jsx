import { createContext, useState, useRef, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setProgress(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const playSong = (song) => {
    setCurrentSong(song);
    audioRef.current.src = song.audioUrl;
    audioRef.current.play().then(() => {
      setIsPlaying(true);
      setIsNowPlayingOpen(true); // Open the big popup!
    }).catch(err => console.error("Playback error:", err));
  };

  const togglePlay = () => {
    if (!currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const changeVolume = (newVolume) => {
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <PlayerContext.Provider value={{
      currentSong, isPlaying, progress, duration, volume, isNowPlayingOpen,
      playSong, togglePlay, seek, changeVolume, setIsNowPlayingOpen
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
