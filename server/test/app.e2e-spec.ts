import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

jest.mock('./../src/config', () => ({
  appConfig: {
    priceApiBaseUrl: 'https://api.binance.com/api/v3',
    guessTimeout: 1,
    symbol: 'BTCUSDT',
  },
}));

describe('Crypto Guesser API (e2e)', () => {
  let app: INestApplication;
  const apiKey = process.env.API_KEY;
  let userId: string;
  let guessId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/price/current (GET) - Get Current Bitcoin Price', () => {
    return request(app.getHttpServer())
      .get('/price/current')
      .set('x-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('price');
        expect(typeof res.body.price).toBe('number');
      });
  });

  it('/users/create (POST) - Create a New User', async () => {
    const res = await request(app.getHttpServer())
      .post('/users/create')
      .set('x-api-key', apiKey)
      .send({ name: 'John Doe' })
      .expect(201);

    userId = res.body.userId;
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('name', 'John Doe');
  });

  it('/users/:userId/score (GET) - Get User Score', async () => {
    if (!userId) {
      const res = await request(app.getHttpServer())
        .post('/users/create')
        .set('x-api-key', apiKey)
        .send({ name: 'John Doe' });
      userId = res.body.userId;
    }
    return request(app.getHttpServer())
      .get(`/users/${userId}/score`)
      .set('x-api-key', apiKey)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('score');
        expect(typeof res.body.score).toBe('number');
      });
  });

  it('/guess/submit (POST) - Submit a Guess', async () => {
    if (!userId) {
      const res = await request(app.getHttpServer())
        .post('/users/create')
        .set('x-api-key', apiKey)
        .send({ name: 'John Doe' });
      userId = res.body.userId;
    }

    const res = await request(app.getHttpServer())
      .post('/guess/submit')
      .set('x-api-key', apiKey)
      .send({
        userId,
        direction: 'up',
        price: 50000,
      })
      .expect(200);

    guessId = res.body.guessId;
    expect(res.body).toHaveProperty('guessId');
    expect(res.body).toHaveProperty('message');
  });

  it('/guess/validate/:guessId (PATCH) - Validate a Guess', async () => {
    if (!guessId) {
      const guessRes = await request(app.getHttpServer())
        .post('/guess/submit')
        .set('x-api-key', apiKey)
        .send({
          userId,
          direction: 'up',
          price: 50000,
        });
      guessId = guessRes.body.guessId;
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return request(app.getHttpServer())
      .patch(`/guess/validate/${guessId}`)
      .set('x-api-key', apiKey)
      .expect((res) => {
        expect(res.body).toHaveProperty('isCorrectGuess');
        expect(typeof res.body.isCorrectGuess).toBe('boolean');
      });
  });

  it('/guess/active/:userId (GET) - Get Active Guess', async () => {
    const guessRes = await request(app.getHttpServer())
      .post('/guess/submit')
      .set('x-api-key', apiKey)
      .send({
        userId,
        direction: 'up',
        price: 50000,
      });
    guessId = guessRes.body.guessId;

    await new Promise((resolve) => setTimeout(resolve, 3000));

    return request(app.getHttpServer())
      .get(`/guess/active/${userId}`)
      .set('x-api-key', apiKey)
      .expect((res) => {
        expect(res.body).toHaveProperty('guessId');
        expect(res.body).toHaveProperty('direction');
      });
  });
});
