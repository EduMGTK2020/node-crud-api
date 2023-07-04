import request from 'supertest';
import server from '../server';

const baseUrl = `http://localhost:${server.getPort()}/`;

const testUser = {
  username: 'Edward',
  age: 55,
  hobbies: ['diving'],
};

let testUserId = '';
const validUserId = '402c00a6-fd6a-427e-95fe-72d57d828036';

beforeAll(() => {
  server.run(true);
});

afterAll((done) => {
  server.close();
  done();
});

describe('1-Tests for Simple CRUD API - valid cases', () => {
  test('Get all records with a GET api/users', async () => {
    const response = await request(baseUrl).get('api/users');
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject([]);
  });

  test('A new object is created by a POST api/users request', async () => {
    const response = await request(baseUrl).post('api/users').send(testUser);
    expect(response.statusCode).toBe(201);

    expect(response.body.username).toBe(testUser.username);
    expect(response.body.age).toBe(testUser.age);
    expect(response.body.hobbies).toMatchObject(testUser.hobbies);

    testUserId = response.body.id;
  });

  test('With a GET api/user/{userId} request, we try to get the created record by its id', async () => {
    const response = await request(baseUrl).get(`api/users/${testUserId}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(testUserId);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.age).toBe(testUser.age);
    expect(response.body.hobbies).toMatchObject(testUser.hobbies);
  });

  test('Try to update the created record with a PUT api/users/{userId} request', async () => {
    testUser.username = 'Mike';
    testUser.age = 15;
    testUser.hobbies = ['football', 'dancing'];

    const response = await request(baseUrl)
      .put(`api/users/${testUserId}`)
      .send(testUser);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.age).toBe(testUser.age);
    expect(response.body.hobbies).toMatchObject(testUser.hobbies);
  });

  test('With a DELETE api/users/{userId} request, we delete the created object by id', async () => {
    const response = await request(baseUrl).delete(`api/users/${testUserId}`);
    expect(response.statusCode).toBe(204);
  });

  test('Request with deleted userId ', async () => {
    const response = await request(baseUrl).get(`api/users/${testUserId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain(
      `Not Found: user with id ${testUserId} doesn't exist`,
    );
  });
});

describe('2-Tests for Simple CRUD API - errors 404 cases', () => {
  test("Request if userId is valid but doesn't exist", async () => {
    const response = await request(baseUrl).get(`api/users/${validUserId}`);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toContain(
      `Not Found: user with id ${validUserId} doesn't exist`,
    );
  });

  test('Request to non-existing endpoints', async () => {
    const response = await request(baseUrl).get('non-existing-endpoint');
    expect(response.statusCode).toBe(404);
  });
});

describe('3-Tests for Simple CRUD API - errors 400 cases', () => {
  test('Request if userId is invalid (not uuid)', async () => {
    const response = await request(baseUrl).get('api/users/111-222-333-444');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Bad Request: invalid user id');
  });

  test('Request with empty body', async () => {
    const response = await request(baseUrl).post('api/users/').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Bad Request: missing or incorrect - username, age, hobbies',
    );
  });

  test('Request with method not implemented', async () => {
    const response = await request(baseUrl).put('api/users/').send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Bad Request: method not implemented');
  });

  test('Request with broken body', async () => {
    const response = await request(baseUrl)
      .post('api/users/')
      .send('broken-body');
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Bad Request: body parsing error - Unexpected token b in JSON at position 0',
    );
  });

  test('Request with incorrect age', async () => {
    const response = await request(baseUrl).post('api/users/').send({
      username: 'John',
      age: '25',
      hobbies: [],
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
      'Bad Request: missing or incorrect - age',
    );
  });
});
