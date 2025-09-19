const request = require('supertest');
const app = require('../server');

jest.mock('fs'); // Mock fs to prevent real writes
const fs = require('fs');

beforeEach(() => {
  // Fake JSON file for tests
  fs.readFileSync.mockReturnValue(JSON.stringify([
    { id: 1, title: 'Mock Task', completed: false }
  ]));
  fs.writeFileSync.mockImplementation(() => {}); // no-op
});

describe('Task API', () => {
  it('should return all tasks', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe('Mock Task');
  });

  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .send({ title: 'New Test Task', completed: false });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'New Test Task');
  });
});
