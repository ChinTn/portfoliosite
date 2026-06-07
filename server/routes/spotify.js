import express from 'express';

const router = express.Router();

const getAccessToken = async () => {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!CLIENT_ID || !CLIENT_SECRET || !REFRESH_TOKEN) {
    throw new Error('Missing Spotify Environment Variables');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await response.json();
  return data.access_token;
};

router.get('/now-playing', async (req, res) => {
  try {
    const access_token = await getAccessToken();

    // Try Currently Playing first
    const nowPlayingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log('Now Playing Status:', nowPlayingRes.status);

    // 204 means nothing is playing right now
    if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
      if (nowPlayingRes.status > 400) {
         const errorText = await nowPlayingRes.text();
         console.error('Spotify Now Playing Error:', errorText);
      }
      
      // Fetch Recently Played (limit 50 to ensure we can sort and find the absolute latest)
      const recentlyPlayedRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=50', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      
      console.log('Recently Played Status:', recentlyPlayedRes.status);

      if (recentlyPlayedRes.status > 400) {
          const errorText = await recentlyPlayedRes.text();
          console.error('Spotify Recently Played Error:', errorText);
          return res.status(200).json({ isPlaying: false, title: 'Not Playing' });
      }

      const recentlyPlayedData = await recentlyPlayedRes.json();
      
      if (!recentlyPlayedData.items || recentlyPlayedData.items.length === 0) {
        return res.status(200).json({ isPlaying: false, title: 'Not Playing' });
      }

      // Sort by played_at descending (newest first) to guarantee accuracy
      const sortedItems = recentlyPlayedData.items.sort((a, b) => new Date(b.played_at) - new Date(a.played_at));
      const latestItem = sortedItems[0];

      const track = latestItem.track;
      const playedAt = latestItem.played_at;

      return res.status(200).json({
        isPlaying: false,
        title: track.name,
        artist: track.artists.map(_artist => _artist.name).join(', '),
        albumImageUrl: track.album.images[0].url,
        songUrl: track.external_urls.spotify,
        playedAt: playedAt
      });
    }

    const song = await nowPlayingRes.json();
    
    if (!song.item) {
        return res.status(200).json({ isPlaying: false, title: 'Not Playing' });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map(_artist => _artist.name).join(', ');
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    return res.status(200).json({
      isPlaying,
      title,
      artist,
      albumImageUrl,
      songUrl,
    });
  } catch (error) {
    console.error('Spotify API Error:', error);
    return res.status(500).json({ message: 'Failed to fetch Spotify data', error: error.message });
  }
});

export default router;
