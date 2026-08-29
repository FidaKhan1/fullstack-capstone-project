process.env.MONGO_URL = 'memory://giftlink';
process.env.JWT_SECRET = 'test-secret';

const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { app } = require('../app');
const { loadData } = require('../util/import-mongo');

test.before(async () => {
    await loadData({ reset: true });
});

test('GET /api/gifts returns sixteen seeded gifts', async () => {
    const response = await request(app).get('/api/gifts');
    assert.equal(response.status, 200);
    assert.equal(response.body.length, 16);
});

test('GET /api/gifts/:id returns one gift', async () => {
    const response = await request(app).get('/api/gifts/875');
    assert.equal(response.status, 200);
    assert.equal(response.body.name, 'Lamp');
});

test('GET /api/search filters by category', async () => {
    const response = await request(app).get('/api/search').query({ category: 'Kitchen' });
    assert.equal(response.status, 200);
    assert.ok(response.body.length >= 1);
    assert.ok(response.body.every((gift) => gift.category === 'Kitchen'));
});

test('register and login return JWTs', async () => {
    const registration = await request(app)
        .post('/api/auth/register')
        .send({ firstName: 'Alex', lastName: 'Rivera', email: 'alex@example.com', password: 'GiftLink123!' });
    assert.equal(registration.status, 201);
    assert.ok(registration.body.authtoken);

    const login = await request(app)
        .post('/api/auth/login')
        .send({ email: 'alex@example.com', password: 'GiftLink123!' });
    assert.equal(login.status, 200);
    assert.ok(login.body.authtoken);
});
