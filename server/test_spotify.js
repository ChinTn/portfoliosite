import dotenv from 'dotenv';
dotenv.config();

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function testSpotify() {
  try {
    console.log('Fetching new access token...');
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
    if (!data.access_token) {
        console.log('FAILED to get access token:', data);
        return;
    }
    const access_token = data.access_token;
    console.log('Got access token. Fetching currently playing...');

    const nowPlayingRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    console.log('Status Code:', nowPlayingRes.status);
    if (nowPlayingRes.status === 204) {
        console.log('204: Nothing is currently playing (Spotify API confirmed Premium access, but no active playback found).');
    } else if (nowPlayingRes.status > 400) {
        const errorText = await nowPlayingRes.text();
        console.log('ERROR Response:', errorText);
    } else {
        const songData = await nowPlayingRes.json();
        console.log('SUCCESS! Playing:', songData.item?.name);
    }
  } catch (err) {
    console.error('Script Error:', err);
  }
}

testSpotify();
