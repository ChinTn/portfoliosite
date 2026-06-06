import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SpotifyWidget.css'; // Let's create a small CSS file for animations

const SpotifyWidget = () => {
  const [data, setData] = useState({ isPlaying: false, track: null, loading: true });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSpotifyData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/spotify/now-playing`);
      setData({ ...response.data, loading: false });
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
        <div className="spotify-content">
          <div className="album-art placeholder-art">
            <i className="fab fa-spotify" style={{ fontSize: '24px', color: '#1db954' }}></i>
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
        <div className="spotify-content">
          <div className="album-art placeholder-art">
            <i className="fab fa-spotify" style={{ fontSize: '24px', color: '#1db954' }}></i>
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
        <img src={data.albumImageUrl} alt="Album Art" className={`album-art ${data.isPlaying ? 'spinning' : ''}`} />
        <div className="song-info">
          <p className="song-title">{data.title}</p>
          <p className="song-artist">{data.artist}</p>
        </div>
      </div>
    </a>
  );
};

export default SpotifyWidget;
