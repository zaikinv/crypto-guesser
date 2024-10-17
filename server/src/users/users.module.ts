import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { UsersRepository } from './users.repository';
import * as dotenv from 'dotenv';
import { fromEnv } from '@aws-sdk/credential-providers';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { AuthModule } from '../auth/auth.module';

dotenv.config();

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
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
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
