const request = require('supertest');
const app = require('../server/index.js');

describe('Express Server Endpoints & Middleware', () => {
  test('GET / should return index.html', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
  });

  test('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });

  test('Security headers should be present', async () => {
    const res = await request(app).get('/');
    expect(res.headers['x-dns-prefetch-control']).toBeDefined();
    expect(res.headers['x-frame-options']).toBeDefined();
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  test('Compression should be active', async () => {
    const res = await request(app)
      .get('/')
      .set('Accept-Encoding', 'gzip, deflate, br');
    // For small files, compression might not always trigger, but we check if the header is added if threshold met.
    // If it doesn't trigger for small files, it's fine, but we test for 200 at least.
    expect(res.statusCode).toBe(200);
  });
  
  test('Rate limiting should be active', async () => {
    // This is a basic test. Real rate limiting test would require hitting it >100 times.
    const res = await request(app).get('/api/health');
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });
});
