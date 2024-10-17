export const appConfig = {
  apiBaseUrl:
    process.env.NODE_ENV === 'production'
      ? 'http://crypto-guesser.eu-central-1.elasticbeanstalk.com/api'
      : 'http://localhost:8080/api',
  priceChangeTimeout: 30000,
  guessTimeout: 60,
};
