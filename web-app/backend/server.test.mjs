import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from './server.mjs';

const port = 3001;
describe('Basic Express API', () => {
  it('GET / should return server running message', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Test server for Tuned is running');
  });

  it('GET /profiles should return an array (possibly empty)', async () => {
    const res = await request(app).get('/profiles');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});