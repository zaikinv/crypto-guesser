export const appConfig = {
  apiBaseUrl:
    process.env.NODE_ENV === 'production'
      ? 'https://d32hsgqukl039n.cloudfront.net/api'
      : 'http://localhost:8080/api',
  priceChangeTimeout: 30000,
  guessTimeout: 60,
};
