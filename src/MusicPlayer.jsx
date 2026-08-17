import { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { handleRadialMouseMove } from './utils/radialMouseMove';
import './MusicPlayer.css';

export default function MusicPlayer({ onPlayStateChange, onOpenQrSidebar }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current || hasEnded) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (onPlayStateChange) onPlayStateChange(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && !hasEnded) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (hasEnded) return;
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipBackward = () => {
    if (hasEnded) return;
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const skipForward = () => {
    if (hasEnded) return;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleExploreClick = () => {
    const ua = navigator.userAgent || '';
    const isMobileDevice =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
      (window.innerWidth <= 768 && 'ontouchstart' in window);

    if (isMobileDevice) {
      // Use maxTouchPoints for iPadOS; navigator.platform is deprecated
      const isIOS =
        /iPhone|iPad|iPod/i.test(ua) ||
        (navigator.maxTouchPoints > 1 && /Mac/.test(ua));

      if (isIOS) {
        window.open('https://apps.apple.com/us/app/temple-girl-kids/id6772048283', '_blank', 'noopener,noreferrer');
      } else {
        window.open('https://play.google.com/store/apps/details?id=com.templegirlkids.templegirl', '_blank', 'noopener,noreferrer');
      }
    } else {
      if (onOpenQrSidebar) {
        onOpenQrSidebar();
      }
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
    <div className={`music-player-layout ${hasEnded ? 'ended-hidden' : ''}`}>
      {/* preload="none" prevents the 5MB .aac file from buffering on page load */}
      <audio
        ref={audioRef}
        src="/krishna_the_little_butter_thief.aac"
        preload="none"
        aria-label="Krishna - The Little Butter Thief story audio"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setHasEnded(true);
          if (duration) setCurrentTime(duration);
          if (onPlayStateChange) onPlayStateChange(false);
        }}
      />

      {/* Fanned Stacked Card Thumbnail Container */}
      <div className={`player-cover-wrapper ${hasEnded ? 'is-stacked-3d' : ''}`}>
        {/* Neutral Left Background Card (Tilted Left from Bottom-Center) */}
        <div className="bg-stacked-card card-left" />

        {/* Neutral Right Background Card (Tilted Right from Bottom-Center) */}
        <div className="bg-stacked-card card-right" />

        {/* Main Front Thumbnail Card */}
        <div className="main-thumbnail-card">
          <img
            src="/krishna_the_little_butter_thief.webp"
            alt="Krishna - The Little Butter Thief story cover art"
            className="player-cover-image"
            width={300}
            height={300}
          />
          <div className="cover-overlay-gradient">
            <div className="player-track-info">
              <h2 className="player-track-title">Krishna - The Little Butter Thief</h2>
              <p className="player-track-artist">Krishna Tales - Guruvayur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Area: Lockstep upward transition replaces controls with Explore More button */}
      <div className="player-bottom-area">
        {/* Music Controls Content */}
        <div className="player-controls-content">
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
                disabled={hasEnded}
                className="timeline-slider"
                aria-label="Playback position"
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
              disabled={hasEnded}
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
                aria-hidden="true"
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
              disabled={hasEnded}
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
              disabled={hasEnded}
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
                aria-hidden="true"
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

        {/* Explore More Button Content */}
        <div className="explore-more-content">
          <button
            type="button"
            className="explore-more-btn"
            onClick={handleExploreClick}
            onMouseMove={handleRadialMouseMove}
            onMouseEnter={handleRadialMouseMove}
            onMouseLeave={handleRadialMouseMove}
            aria-label="Explore more stories"
          >
            <span className="explore-btn-text">
              Explore More
              <svg
                className="explore-arrow-icon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
