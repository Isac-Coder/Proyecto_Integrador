const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const defaultPort = Number(process.env.PORT) || 5500;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4'
};

const root = path.join(__dirname, 'src');

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0];
  let urlPath = requestPath === '/' ? '/index.html' : requestPath;

  try {
    urlPath = decodeURIComponent(urlPath);
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Solicitud inválida');
    return;
  }

  const safePath = path.normalize(urlPath).replace(/^\/+/, '');
  const filePath = path.join(root, safePath || 'index.html');

  if (!filePath.startsWith(root)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Acceso denegado');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Archivo no encontrado');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

function listenOnPort(port) {
  server.once('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      listenOnPort(port + 1);
    } else {
      console.error(error);
      process.exit(1);
    }
  });

  server.listen(port, hostname, () => {
    console.log(`Frontend corriendo en http://${hostname}:${port}`);
  });
}

listenOnPort(defaultPort);
