import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpotifyWidget.css'; // Let's create a small CSS file for animations

const SpotifyWidget = () => {
  const [data, setData] = useState({ isPlaying: false, track: null, loading: true });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSpotifyData = async () => {
    try {
      // Add a timestamp cache-buster so the browser never caches the old song!
      const response = await axios.get(`${API_URL}/api/spotify/now-playing?t=${Date.now()}`);
      setData(prevData => ({ ...prevData, ...response.data, loading: false }));
    } catch (err) {
      console.error('Failed to fetch Spotify data');
      setData({ isPlaying: false, track: null, loading: false });
    }
  };

  useEffect(() => {
    fetchSpotifyData();
    const interval = setInterval(fetchSpotifyData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  if (data.loading) {
    return (
      <div className="spotify-widget loading">
        <div className="spotify-content group">
          <div className="album-art placeholder-art">
            <i className="fab fa-spotify text-highlight group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" style={{ fontSize: '24px' }}></i>
          </div>
          <div className="song-info">
            <p className="song-title">Spotify</p>
            <p className="song-artist">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data.title || data.title === 'Not Playing') {
    return (
      <div className="spotify-widget not-playing">
        <div className="spotify-content group">
          <div className="album-art placeholder-art">
            <i className="fab fa-spotify text-highlight group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" style={{ fontSize: '24px' }}></i>
          </div>
          <div className="song-info">
            <p className="song-title">Spotify</p>
            <p className="song-artist">Currently offline</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a href={data.songUrl} target="_blank" rel="noreferrer" className="spotify-widget">
      <div className="spotify-content">
        <div className="album-art-container">
          <img src={data.albumImageUrl} alt="Album Art" className="album-art" />
          <span className={`status-dot ${data.isPlaying ? 'green-dot' : 'red-dot'}`}></span>
        </div>
        <div className="song-info">
          <p className="song-status">
            {data.isPlaying ? (
              <span className="playing-text">NOW PLAYING</span>
            ) : (
              <span className="paused-text">RECENTLY PLAYED</span>
            )}
          </p>
          <p className="song-title">{data.title}</p>
          <p className="song-artist">{data.artist}</p>
        </div>
        {data.isPlaying && (
          <div className="equalizer-right">
            <span className="equalizer">
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </span>
          </div>
        )}
      </div>
    </a>
  );
};

export default SpotifyWidget;
