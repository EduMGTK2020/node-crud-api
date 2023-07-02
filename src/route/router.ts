import { IncomingMessage, ServerResponse } from 'http';
import { validate as isUserIdValid } from 'uuid';

const apiUrl = /^\/api\/users\/?$/;
const apiUrlWithId = /^\/api\/users\/[^\/]+$/;
const apiUserId = /\/api\/users\/([\w-]+)/;

const urlIsValid = (url: string) => {
  if (!url.match(apiUrl) && !url.match(apiUrlWithId)) return false;
  return true;
};

const getId = (url: string) => {
  const groups = url.match(apiUserId);
  return groups ? groups[1] : null;
};

export default (port: number) => {
  return async (request: IncomingMessage, response: ServerResponse) => {
    const method = request.method;
    const url: string = request.url || '';

    console.log(`Incoming request: ${method} ${url} on port ${port}`);

    if (!urlIsValid(url)) {
      response.statusCode = 404;
      response.write('non-existing endpoints');
      response.end();
    } else {
      const userId = getId(url);

      console.log(userId);

      if (userId && !isUserIdValid(userId)) {
        response.statusCode = 400;
        response.write('invalid user id');
        response.end();
      } else {
        response.write(url);
        response.statusCode = 200;
        response.end();
      }
    }
  };
};
