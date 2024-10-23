import { Module } from '@nestjs/common';
import { PriceModule } from './price/price.module';
import { UsersModule } from './users/users.module';
import { GuessModule } from './guess/guess.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

// 1 min window
const THROTTLER_TTL = 60000;
// 60 requests per 1 min window
const THROTTLER_LIMIT = 60;

@Module({
  imports: [
    PriceModule,
    UsersModule,
    GuessModule,
    ...(process.env.NODE_ENV === 'production'
      ? [
          ServeStaticModule.forRoot({
            rootPath: join(__dirname, 'public'),
          }),

          ThrottlerModule.forRoot([
            {
              ttl: THROTTLER_TTL,
              limit: THROTTLER_LIMIT,
            },
          ]),
        ]
      : []),
  ],
  controllers: [],
  providers: [
    ...(process.env.NODE_ENV === 'production'
      ? [
          {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
          },
        ]
      : []),
  ],
})
export class AppModule {}
