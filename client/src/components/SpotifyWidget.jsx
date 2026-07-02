import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SpotifyWidget = () => {
  const [data, setData] = useState({ isPlaying: false, track: null, loading: true });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const fetchSpotifyData = async () => {
    try {
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

  if (data.loading || (!data.title || data.title === 'Not Playing')) {
    return (
      <div className="spotify-widget-minimal group cursor-default text-left">
        <div className="song-status mb-2 text-text-dim text-[10px] tracking-[0.2em] uppercase font-semibold">
          STATUS
        </div>
        <div className="spotify-content flex items-center gap-3">
          <div className="album-art-container relative">
            <div className="w-12 h-12 rounded bg-card-bg-light border border-border-dim/20 flex items-center justify-center">
               <i className="fab fa-spotify text-text-dim/50 text-xl"></i>
            </div>
          </div>
          <div className="song-info flex flex-col justify-center">
            <p className="song-title text-text-dim font-bold text-sm">Spotify</p>
            <p className="song-artist text-text-dim/60 text-xs font-medium">Currently offline</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a href={data.songUrl} target="_blank" rel="noreferrer" className="spotify-widget-minimal group block text-left max-w-[220px]">
      <div className="song-status mb-2 text-text-dim text-[11px] tracking-[0.15em] uppercase font-medium">
        {data.isPlaying ? 'NOW PLAYING' : 'LAST PLAYED'}
      </div>
      <div className="spotify-content flex items-center gap-4">
        <div className="album-art-container relative shrink-0">
          <img src={data.albumImageUrl} alt="Album Art" className="album-art w-12 h-12 rounded bg-card-bg border border-border-dim/20 object-cover" />
          <span className={`status-dot absolute -bottom-[3px] -right-[3px] w-2.5 h-2.5 rounded-full border-[2px] border-bg-dark ${data.isPlaying ? 'bg-[#1db954] shadow-[0_0_8px_rgba(29,185,84,0.6)] animate-[pulse_2s_ease-in-out_infinite]' : 'bg-[#ef4444]'}`}></span>
        </div>
        <div className="song-info flex flex-col justify-center min-w-0">
          <p className="song-title text-[#e5e5e5] font-extrabold text-[15px] flex items-center gap-2 group-hover:text-highlight transition-colors leading-tight">
            <span className="truncate max-w-[120px] md:max-w-[140px]">{data.title}</span>
            <i className="fas fa-external-link-alt text-[10px] text-text-dim group-hover:text-highlight transition-colors shrink-0"></i>
          </p>
          <p className="song-artist text-[#888888] text-[13px] font-medium leading-relaxed truncate max-w-[140px] md:max-w-[160px]">
            {data.artist}
          </p>
        </div>
      </div>
    </a>
  );
};

export default SpotifyWidget;
