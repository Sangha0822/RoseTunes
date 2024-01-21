/*import express from 'express';
import crypto from 'crypto';
import fetch from 'node-fetch';
import {LocalStorage} from 'node-localstorage';

const app = express();

const localStorage = new LocalStorage('./scratch');

const clientId = 'ec7338334abc4d5086411cd44a3ef2d5';
const redirectUri = 'http://localhost:8080';
const tokenUrl = 'https://accounts.spotify.com/api/token'; // Spotify token endpoint
const apiEndpoint = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V'; // Spotify API endpoint
const scope = 'user-read-private user-read-email';
const authUrl = new URL("https://accounts.spotify.com/authorize")

app.use(express.static('public'));
app.use(express.static('main.js'));


app.get('/', (req, res) => {
    // Serve your index.html here
    const indexPath = new URL('index.html', import.meta.url).pathname;
    res.sendFile(indexPath);
});

app.get('/callback', async (req, res) => {
    const authorizationCode = req.query.code;

    if (authorizationCode) {
        const codeVerifier = localStorage.getItem('code_verifier');
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        try {
            const response = await fetch(tokenUrl, payload);
            const tokenData = await response.json();
            localStorage.setItem('access_token', tokenData.access_token);
            console.log('Access Token:', tokenData.access_token);
        } catch (error) {
            console.error('Error getting access token:', error.message);
        }

        // Redirect to the success page
        res.sendFile(__dirname + '/public/success.html');
    } else {
        console.error('Authorization code not found in the URL.');
        res.status(400).send('Bad Request');
    }
});

const port = 8080;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});*/

import express from 'express';
import { LocalStorage } from 'node-localstorage';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtain the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const localStorage = new LocalStorage('./scratch');

const clientId = 'ec7338334abc4d5086411cd44a3ef2d5';
const redirectUri = 'http://localhost:8080';
const tokenUrl = 'https://accounts.spotify.com/api/token'; // Spotify token endpoint
const apiEndpoint = 'https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V'; // Spotify API endpoint
const scope = 'user-read-private user-read-email';

app.use(express.static('public')); // Serve static files from the 'public' directory

app.get('/', (req, res) => {
    const indexPath = new URL('index.html', import.meta.url).pathname;
    res.sendFile(indexPath);
});

// Your existing /callback route and other server code here...
app.get('/callback', async (req, res) => {
    console.log('callback initiated');

    const authorizationCode = req.query.code;

    if (authorizationCode) {
        /*const codeVerifier = localStorage.getItem('code_verifier');
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        };

        try {
            const response = await fetch(tokenUrl, payload);
            const tokenData = await response.json();
            localStorage.setItem('access_token', tokenData.access_token);
            console.log('Access Token:', tokenData.access_token);
        } catch (error) {
            console.error('Error getting access token:', error.message);
        }*/
        await getToken(authorizationCode);


        // Use __dirname to construct the file path
        res.sendFile(__dirname + '/success.html');
    } else {
        console.error('Authorization code not found in the URL.');
        res.status(400).send('Bad Request');
    }
});

const getToken = async code => {
    console.log("getToken accessed");
    // stored in the previous step
    let codeVerifier = localStorage.getItem('code_verifier');
  
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    }
  
    const body = await fetch(tokenUrl, payload);
    const response =await body.json();
  
    localStorage.setItem('access_token', response.access_token);
  }


const port = 8080;

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});