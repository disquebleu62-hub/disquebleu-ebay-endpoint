const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // eBay envoie une requête GET pour vérifier l'endpoint
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://localhost`);
    const challenge = url.searchParams.get('challenge_code');
    if (challenge) {
      // Répondre avec le challenge_code pour valider l'endpoint
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ challengeResponse: challenge }));
      return;
    }
  }

  // eBay envoie les notifications de suppression en POST
  if (req.method === 'POST') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      console.log('Notification eBay reçue:', body.substring(0, 200));
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
