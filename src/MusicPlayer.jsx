import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import './MusicPlayer.css';

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const skipForward = () => {
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="music-player-layout">
      <audio
        ref={audioRef}
        src="/krishna_the_little_butter_thief.aac"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Cover Art Image with Gradient Overlay & Track Info */}
      <div className="player-cover-wrapper">
        <img
          src="/krishna_the_little_butter_thief.png"
          alt="Krishna - The Little Butter Thief"
          className="player-cover-image"
        />
        <div className="cover-overlay-gradient">
          <div className="player-track-info">
            <h2 className="player-track-title">Krishna - The Little Butter Thief</h2>
            <p className="player-track-artist">Krishna Tales - Guruvayur</p>
          </div>
        </div>
      </div>

      {/* Timeline Scrubber */}
      <div className="player-timeline">
        <div className="progress-bar-container">
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="timeline-slider"
            style={{
              background: `linear-gradient(to right, #ffffff ${progressPercent}%, rgba(255, 255, 255, 0.25) ${progressPercent}%)`
            }}
          />
        </div>
        <div className="time-display">
          <span className="time-current">{formatTime(currentTime)}</span>
          <span className="time-duration">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Media Controls */}
      <div className="player-controls">
        <button
          type="button"
          className="control-btn skip-btn"
          onClick={skipBackward}
          aria-label="Rewind 10 seconds"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <text
              x="12"
              y="13"
              fontSize="7"
              fontWeight="700"
              fontFamily="sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              stroke="none"
            >
              10
            </text>
          </svg>
        </button>

        <button
          type="button"
          className="play-pause-btn"
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} fill="currentColor" color="#ffffff" />
          ) : (
            <Play size={24} fill="currentColor" color="#ffffff" />
          )}
        </button>

        <button
          type="button"
          className="control-btn skip-btn"
          onClick={skipForward}
          aria-label="Forward 10 seconds"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <text
              x="12"
              y="13"
              fontSize="7"
              fontWeight="700"
              fontFamily="sans-serif"
              textAnchor="middle"
              dominantBaseline="central"
              fill="currentColor"
              stroke="none"
            >
              10
            </text>
          </svg>
        </button>
      </div>
    </div>
  );
}
