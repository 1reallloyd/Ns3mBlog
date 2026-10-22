// Local dev server (no dependencies, Node 18+):  node server.js  →  http://localhost:8080
const http = require('http');
const fs = require('fs');
const path = require('path');
const { handler } = require('./netlify/functions/feed.js');

const PORT = Number(process.env.PORT) || 8080;
const PUBLIC = path.join(__dirname, 'public');

function createServer() {
  return http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://localhost');
    if (u.pathname === '/api/feed') {
      const out = await handler({ queryStringParameters: { url: u.searchParams.get('url') } });
      res.writeHead(out.statusCode, out.headers || { 'Content-Type': 'text/plain' });
      return res.end(out.body);
    }
    const file = path.join(PUBLIC, u.pathname === '/' ? 'index.html' : path.normalize(u.pathname));
    if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end('Not found'); }
      const type = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[path.extname(file)] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': type + '; charset=utf-8' });
      res.end(data);
    });
  });
}

function listen(port) {
  const server = createServer();
  server.once('error', error => {
    if (error.code === 'EADDRINUSE') {
      console.warn('Port ' + port + ' is already in use; trying ' + (port + 1) + '.');
      listen(port + 1);
      return;
    }
    throw error;
  });
  server.listen(port, () => console.log('NsemBlog running at http://localhost:' + port));
}

listen(PORT);
