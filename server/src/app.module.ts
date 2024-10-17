import { Module } from '@nestjs/common';
import { PriceModule } from './price/price.module';
import { UsersModule } from './users/users.module';
import { GuessModule } from './guess/guess.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

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
        ]
      : []),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
