import { createServer } from 'http';
import config from './config';
import router from './router';

const { PORT } = config;

const server = createServer(router(PORT));
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
