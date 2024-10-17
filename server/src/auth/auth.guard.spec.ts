import { UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let apiKeyGuard: AuthGuard;

  beforeEach(() => {
    apiKeyGuard = new AuthGuard();
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.API_KEY;
    delete process.env.NODE_ENV;
  });

  it('should be defined', () => {
    expect(apiKeyGuard).toBeDefined();
  });

  it('should allow access without API key in non-production environments', async () => {
    process.env.NODE_ENV = 'development';

    expect(
      await apiKeyGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as any),
    ).toBe(true);
  });

  it('should allow access with valid API key in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.API_KEY = 'valid-api-key';

    expect(
      await apiKeyGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-api-key': 'valid-api-key',
            },
          }),
        }),
      } as any),
    ).toBe(true);
  });

  it('should throw UnauthorizedException with missing API key in production', async () => {
    process.env.NODE_ENV = 'production';

    try {
      await apiKeyGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {},
          }),
        }),
      } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('API key is missing.');
    }
  });

  it('should throw UnauthorizedException with invalid API key in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.API_KEY = 'valid-api-key';

    try {
      await apiKeyGuard.canActivate({
        switchToHttp: () => ({
          getRequest: () => ({
            headers: {
              'x-api-key': 'invalid-api-key',
            },
          }),
        }),
      } as any);
    } catch (error) {
      expect(error).toBeInstanceOf(UnauthorizedException);
      expect(error.message).toBe('Invalid API key.');
    }
  });
});
