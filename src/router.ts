import { IncomingMessage, ServerResponse } from 'http';
import { validate as isUserIdValid } from 'uuid';
import { HTTPError, Error400, Error404 } from './errors';

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

    try {
      if (!urlIsValid(url)) {
        throw new Error404('non-existing endpoints');
      }

      const userId = getId(url);
      if (userId && !isUserIdValid(userId)) {
        throw new Error400('invalid user id');
      }

      response.write(url);
      response.statusCode = 200;
      response.end();
    } catch (error) {
      const status = (error as HTTPError).statusCode;
      const message = (error as HTTPError).message;
      response.statusCode = status;
      response.end(
        JSON.stringify({
          status,
          message,
        }),
      );
    }
  };
};
