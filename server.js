const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const VERIFICATION_TOKEN = 'disquebleu2026ABCDEFGHIJKLMNOPQRSTUVWXYZabcd';
const ENDPOINT_URL = 'https://disquebleu-ebay-endpoint.onrender.com';

const server = http.createServer((req, res) => {
  console.log(req.method + ' ' + req.url);

  if (req.method === 'GET') {
    const url = new URL(req.url, `http://localhost`);
    const challengeCode = url.searchParams.get('challenge_code');

    if (challengeCode) {
      // eBay attend : SHA-256(challengeCode + verificationToken + endpointUrl)
      const hash = crypto.createHash('sha256')
        .update(challengeCode + VERIFICATION_TOKEN + ENDPOINT_URL)
        .digest('hex');

      console.log('Challenge: ' + challengeCode);
      console.log('Hash: ' + hash);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ challengeResponse: hash }));
      return;
    }
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      console.log('Notification eBay:', body.substring(0, 200));
      res.writeHead(200);
      res.end('OK');
    });
    return;
  }

  res.writeHead(200);
  res.end('DisqueBleu eBay Endpoint OK');
});

server.listen(PORT, () => {
  console.log('Serveur démarré sur le port ' + PORT);
});
