import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { build, root, output } from './build.mjs';

await build();
const portFlag = process.argv.indexOf('--port');
const port = portFlag < 0 ? 4173 : Number(process.argv[portFlag + 1]);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Use --port with a number between 1 and 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.zip': 'application/zip', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
let buildError;
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    if (buildError) {
      response.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' }).end(`Build failed. Fix the error and save again:\n${buildError.message}`);
      return;
    }
    const url = new URL(request.url, 'http://localhost');
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400).end('Malformed URL.');
      return;
    }
    let path = resolve(output, `.${pathname}`);
    if (!path.startsWith(output + sep) && path !== output) {
      response.writeHead(403).end('Forbidden.');
      return;
    }
    let statusCode = 200;
    try {
      if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
      await stat(path);
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR'].includes(error.code)) throw error;
      path = resolve(output, '404.html');
      statusCode = 404;
    }
    const body = await readFile(path);
    response.writeHead(statusCode, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    console.error('Preview request failed:', error);
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Preview server error. See the terminal for details.');
  }
});
server.on('error', error => { console.error(error); process.exit(1); });
server.listen(port, '127.0.0.1', () => console.log(`Handbook preview: http://127.0.0.1:${port}`));

if (process.argv.includes('--watch')) {
  let timer;
  let queue = Promise.resolve();
  watch(root, { recursive: true }, (event, filename) => {
    if (!filename || /^(?:node_modules|dist|\.git)(?:\/|$)/.test(filename) || !/\.(?:md|mjs|js|css)$/.test(filename)) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      queue = queue.then(async () => {
        try {
          const { stdout } = await promisify(execFile)(process.execPath, [resolve(root, 'scripts/build.mjs')]);
          process.stdout.write(stdout);
          buildError = undefined;
          console.log('Rebuilt. Refresh the browser to see your changes.');
        } catch (error) {
          buildError = error;
          console.error('Rebuild failed:', error);
        }
      });
    }, 200);
  });
}
