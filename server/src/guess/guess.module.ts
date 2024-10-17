import { Module } from '@nestjs/common';
import { GuessController } from './guess.controller';
import { GuessService } from './guess.service';
import { PriceService } from '../price/price.service';
import { UsersService } from '../users/users.service';
import { GuessRepository } from './guess.repository';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { fromEnv } from '@aws-sdk/credential-providers';
import * as dotenv from 'dotenv';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

dotenv.config();

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [GuessController],
  providers: [
    GuessService,
    GuessRepository,
    PriceService,
    UsersService,
    {
      provide: DynamoDBDocumentClient,
      useFactory: () => {
        // @ts-ignore
        const client = new DynamoDBClient({
          credentials: fromEnv(),
          region: process.env.AWS_REGION,
        });
        return DynamoDBDocumentClient.from(client);
      },
    },
  ],
})
export class GuessModule {}
