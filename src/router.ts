import { IncomingMessage, ServerResponse } from 'http';
import { HTTPError, Error400, Error404 } from './errors';
import utils from './utils';
import db from './db';

export default (port: number) => {
  return async (request: IncomingMessage, response: ServerResponse) => {
    const method = request.method;
    const url: string = request.url || '';

    response.setHeader('Content-Type', 'application/json');
    console.log(`Incoming request: ${method} ${url} on port ${port}`);

    try {
      if (!utils.urlIsValid(url)) {
        throw new Error404('non-existing endpoints');
      }

      const userId = utils.getId(url);
      if (userId && !utils.isUserIdValid(userId)) {
        throw new Error400('invalid user id');
      }

      let result = null;

      if (userId) {
        switch (method) {
          case 'GET':
            console.log('get one', userId);
            await db.getUserById(userId);
            break;
          case 'PUT':
            console.log('update one');
            break;
          case 'PUT':
            console.log('put one');
            break;
          case 'DELETE':
            console.log('remove one');
            break;
          default:
            throw new Error400('method not implemented');
        }
      } else {
        switch (method) {
          case 'GET':
            console.log('get all');
            result = await db.getAllUsers();

            break;
          case 'POST':
            console.log('create one');
            break;
          default:
            throw new Error400('method not implemented');
        }
      }
      response.statusCode = 200;
      response.end(JSON.stringify(result));
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
