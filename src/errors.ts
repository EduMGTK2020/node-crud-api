export class HTTPError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 0;
  }
}

export class Error400 extends HTTPError {
  constructor(message: string) {
    super(message);
    this.message = 'Bad Request: ' + message;
    this.statusCode = 400;
  }
}

export class Error404 extends HTTPError {
  constructor(message: string) {
    super(message);
    this.message = 'Not Found: ' + message;
    this.statusCode = 404;
  }
}
