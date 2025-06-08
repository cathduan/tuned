// import { describe, it, expect } from 'vitest';
// import request from 'supertest';
// import app from './server.mjs';

// describe('Basic Express API', () => {
//   it('GET / should return server running message', async () => {
//     const res = await request(app).get('/');
//     expect(res.status).toBe(200);
//     expect(res.text).toContain('Test server for Tuned is running');
//   });

//   it('GET /profiles should return an array (possibly empty)', async () => {
//     const res = await request(app).get('/profiles');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /reviews should return an array (possibly empty)', async () => {
//     const res = await request(app).get('/reviews');
//     expect(res.status).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//   });

//   it('GET /nonexistent should return 404', async () => {
//     const res = await request(app).get('/nonexistent');
//     expect(res.status).toBe(404);
//   });
// });

//import { describe, it, expect, beforeAll, vi } from 'vitest';
import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from './server.mjs';


// Mock pg Pool before tests run
vi.mock('pg', async () => {
  const mPool = {
    query: vi.fn(),
  };
  return {
    Pool: vi.fn(() => mPool),
  };
});

let mockPool;

beforeAll(async () => {
  const { Pool } = await import('pg');
  mockPool = new Pool();
});

describe('Tuned server basic tests', () => {
  beforeEach(() => {
    mockPool.query.mockReset();
  });

  it('should return server running message at /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Test server for Tuned is running');
  });

  it('should register a user if they don’t already exist', async () => {
    // Simulate no existing user
    mockPool.query
      .mockResolvedValueOnce({ rows: [] }) // check if user exists
      .mockResolvedValueOnce({ rows: [{ id: 1, username: 'testuser' }] }); // insert user

    const res = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
    expect(res.body.user.username).toBe('testuser');
  });

  it('should return error if user already exists', async () => {
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, username: 'testuser' }],
    });

    const res = await request(app)
      .post('/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});