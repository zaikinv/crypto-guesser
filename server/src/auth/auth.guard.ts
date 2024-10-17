import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (process.env.NODE_ENV !== 'production') {
      return true;
    }

    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      console.error('[ApiKeyGuard] API key is missing.');
      throw new UnauthorizedException('API key is missing.');
    }

    if (apiKey !== process.env.API_KEY) {
      console.error('[ApiKeyGuard] Invalid API key.');
      throw new UnauthorizedException('Invalid API key.');
    }

    return true;
  }
}
