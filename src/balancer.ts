import http, { createServer, IncomingMessage, ServerResponse } from 'http';
import router from './router';
import config from './config';
import os from 'os';
import cluster, { Worker } from 'cluster';
import { User } from './types';

const { PORT } = config;

const parallelism = os.cpus().length - 1;
const minPort = PORT + 1;
const maxPort = PORT + parallelism;
let currentPort = minPort;

const workers: Worker[] = [];

if (cluster.isPrimary) {
  const onProxy = (request: IncomingMessage, response: ServerResponse) => {
    const method = request.method;
    const url: string = request.url || '';
    console.log(
      `Incoming request: ${method} ${url} on port ${PORT} (pid: ${process.pid}) => redirect to ${currentPort}`,
    );

    const proxy = http.request(
      'http://localhost:' + currentPort,
      {
        path: request.url,
        method: request.method,
        headers: request.headers,
      },
      function (workerResponse: IncomingMessage) {
        const statusCode = workerResponse.statusCode || 0;
        response.writeHead(statusCode, workerResponse.headers);
        workerResponse.pipe(response, {
          end: true,
        });
      },
    );

    request.pipe(proxy, {
      end: true,
    });

    // Round-robin
    if (currentPort < maxPort) {
      currentPort++;
    } else {
      currentPort = minPort;
    }
  };

  createServer(onProxy).listen(PORT, () => {
    console.log(
      `Balancer server is listening on port ${PORT} (pid: ${process.pid})`,
    );
  });

  for (let i = 0; i < parallelism; i++) {
    const worker = cluster.fork({ PORT: PORT + i + 1 });
    workers.push(worker);
    worker.on('message', (data) => {
      for (const w of workers) {
        if (w !== worker) w.send(data);
      }
    });
  }
} else {
  const server = createServer(router.handler(PORT, false, true));

  process.on('message', async (data) => {
    const db = await router.getDb();
    db.splice(0, db.length);
    (data as User[]).map((item) => {
      db.push(item);
    });
  });

  server.listen(PORT, () => {
    console.log(`Worker server listening on port ${PORT} (id: ${process.pid})`);
  });
}
