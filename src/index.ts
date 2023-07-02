import { createServer, IncomingMessage, ServerResponse } from 'http';
import config from './config';

const { PORT } = config;

const server = createServer(
  (request: IncomingMessage, response: ServerResponse) => {
    console.log(request.url);
    response.end('Hello world!');
  }
);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
