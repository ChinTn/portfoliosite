import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = 5000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:5000/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env file!');
  process.exit(1);
}

app.get('/login', (req, res) => {
  const scopes = 'user-read-currently-playing user-read-recently-played';
  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(
      scopes
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  );
});

app.get('/callback', async (req, res) => {
  const code = req.query.code || null;

  if (!code) {
    return res.send('Error: No code provided');
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'),
      },
      body: new URLSearchParams({
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (data.refresh_token) {
      console.log('\n✅ SUCCESS! Here is your Refresh Token:\n');
      console.log('====================================================');
      console.log(data.refresh_token);
      console.log('====================================================\n');
      console.log('👉 Copy this token and save it in your .env file as SPOTIFY_REFRESH_TOKEN');
      console.log('You can now close this terminal with Ctrl+C.');
      res.send('<h1>Success!</h1><p>Check your VS Code terminal for the Refresh Token.</p>');
      
      // Auto shutdown server after 2 seconds
      setTimeout(() => process.exit(0), 2000);
    } else {
      console.error('Error fetching token:', data);
      res.send('<p>Error getting token. Check terminal.</p>');
    }
  } catch (err) {
    console.error('Fetch error:', err);
    res.send('<p>Server error. Check terminal.</p>');
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Setup Server Running!`);
  console.log(`Click this link to log in to Spotify: http://127.0.0.1:${PORT}/login\n`);
});
