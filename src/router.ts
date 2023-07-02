import { IncomingMessage, ServerResponse } from 'http';
import { HTTPError, Error400, Error404 } from './errors';
import utils from './utils';

export default (port: number) => {
  return async (request: IncomingMessage, response: ServerResponse) => {
    const method = request.method;
    const url: string = request.url || '';

    console.log(`Incoming request: ${method} ${url} on port ${port}`);

    try {
      if (!utils.urlIsValid(url)) {
        throw new Error404('non-existing endpoints');
      }

      const userId = utils.getId(url);
      if (userId && !utils.isUserIdValid(userId)) {
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
