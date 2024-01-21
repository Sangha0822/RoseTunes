document.getElementById('loginButton').addEventListener('click', () => {
    authorizeAndFetchData(clientId);
});

// Main function to execute the authorization flow
async function authorizeAndFetchData(clientId) {
    console.log('Authorization flow initiated.');

    const codeChallenge = await generateCodeChallenge();

    // Assuming the authorization flow is successful
    // Redirect the user to a successful login page
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    const params = {
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        scope: 'user-read-private user-read-email',
    };
    authUrl.search = new URLSearchParams(params).toString();

    // Redirect the user to the Spotify login page
    window.location.href = authUrl.toString();
}


const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
  }


// Base64 encode function
const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  }
  
// Helper function to generate a random string
function generateRandomString(length) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        result += charset.charAt(randomIndex);
    }
    return result;
}

// Use the code verifier to generate code challenge
async function generateCodeChallenge() {
    const codeVerifier = generateRandomString(64);
    console.log('Code Verifier:', codeVerifier);

    const hashed = await sha256(codeVerifier);
    console.log('Hashed Code Verifier:', hashed);

    const base64Encoded = base64encode(hashed);
    console.log('Base64 Encoded Code Challenge:', base64Encoded);

    return base64Encoded;
}

const getToken = async code => {
    console.log("ROSE");
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
  
    const body = await fetch(url, payload);
    const response =await body.json();
  
    localStorage.setItem('access_token', response.access_token);
  }

