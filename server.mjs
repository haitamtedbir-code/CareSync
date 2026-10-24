import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

const root = fileURLToPath(new URL('./public/', import.meta.url));
const port = 5173;
const url = `http://localhost:${port}`;
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json; charset=utf-8',
};
const server = http.createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(req.url, url).pathname);
    const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (!filename.startsWith(path.resolve(root) + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    const file = await fs.readFile(filename);
    res.writeHead(200, {
      'Content-Type': mime[path.extname(filename)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : file);
  } catch (error) {
    res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 400, {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    res.end('Fichier introuvable.');
  }
});
server.on('error', (error) => {
  console.error(
    error.code === 'EADDRINUSE'
      ? 'Le port 5173 est deja utilise. Fermez le serveur precedent, puis relancez CareSync.'
      : error.message,
  );
  process.exitCode = 1;
});
server.listen(port, 'localhost', () => {
  console.log(`CareSync disponible : ${url}`);
  console.log('Gardez ce terminal ouvert pendant votre utilisation.');
  if (process.argv.includes('--open')) {
    if (process.platform === 'win32') execFile('cmd.exe', ['/d', '/c', 'start', '', url]);
    else if (process.platform === 'darwin') execFile('open', [url]);
    else execFile('xdg-open', [url], () => {});
  }
});
