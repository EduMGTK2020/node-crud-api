import { Server, createServer } from 'http';
import config from './config';
import router from './router';

let server: Server;
const { PORT } = config;

const run = () => {
  server = createServer(router(PORT));

  server.on('error', (error: Error) => {
    console.log(`Server stopped: ${(error as Error).message}`);
  });

  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
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
