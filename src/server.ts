import { Server, createServer } from 'http';
import config from './config';
import router from './router';

let server: Server;
const { PORT } = config;

const run = (silent?: boolean) => {
  server = createServer(router(PORT, silent));

  server.on('error', (error: Error) => {
    console.log(`Server stopped: ${(error as Error).message}`);
  });

  server.listen(PORT, () => {
    if (!silent) console.log(`Server listening on port ${PORT}`);
  });
};

const close = () => {
  server.close();
};

const getPort = () => {
  return PORT;
};

export default {
  run,
  close,
  getPort,
};
