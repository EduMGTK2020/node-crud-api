import { createServer, IncomingMessage, ServerResponse } from 'http';
import config from './config';
import router from './route/router';

const { PORT } = config;

const server = createServer(router(PORT));
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
