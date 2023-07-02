import { IncomingMessage, ServerResponse } from 'http';
import { HTTPError, Error400, Error404 } from './errors';
import utils from './utils';
import db from './db';

const getRequestBody = async (request: IncomingMessage): Promise<Object> => {
  let body = '';

  request.on('data', (chunk) => {
    body += chunk.toString();
  });

  return new Promise((resolve, reject) => {
    request.on('end', () => {
      try {
        const requestBody = JSON.parse(body);
        resolve(requestBody);
      } catch (error) {
        reject(
          new Error400('body parsing error - ' + (error as Error).message),
        );
      }
    });
  });
};

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
      let statusCode = 200;

      if (userId) {
        switch (method) {
          case 'GET':
            result = await db.getUserById(userId);
            break;
          case 'PUT':
            console.log('update one');
            break;
          case 'DELETE':
            result = await db.deleteUser(userId);
            statusCode = 204;
            break;
          default:
            throw new Error400('method not implemented');
        }
      } else {
        switch (method) {
          case 'GET':
            result = await db.getAllUsers();
            break;
          case 'POST':
            result = await db.addNewUser(await getRequestBody(request));
            statusCode = 201;
            break;
          default:
            throw new Error400('method not implemented');
        }
      }

      response.statusCode = statusCode;
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
