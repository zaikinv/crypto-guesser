import { Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { User } from './users.interface';

@Injectable()
export class UsersRepository {
  private readonly tableName = 'Users';
  private dynamoDb: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDb = dynamoDbClient;
  }

  async getUser(userId: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { userId },
    };

    try {
      const result = await this.dynamoDb.send(new GetCommand(params));
      return result.Item ? (result.Item as User) : null;
    } catch (error) {
      console.log(`Error fetching user score for userId: ${userId}`, error);
      throw new Error('Unable to fetch user score');
    }
  }

  async createUser(name: string, userId: string): Promise<User> {
    const user: User = {
      userId,
      name,
      score: 0,
    };

    const params = {
      TableName: this.tableName,
      Item: user,
    };

    try {
      await this.dynamoDb.send(new PutCommand(params));
      return user;
    } catch (error) {
      console.log('Error creating user in DynamoDB:', error);
      throw new Error('Unable to create user');
    }
  }

  async updateUserScore(userId: string, correctGuess: boolean): Promise<User> {
    const increment = correctGuess ? 1 : -1;

    const params = {
      TableName: this.tableName,
      Key: { userId },
      UpdateExpression: 'set score = if_not_exists(score, :default) + :inc',
      ExpressionAttributeValues: {
        ':inc': increment,
        ':default': 0,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      // @ts-ignore
      const result = await this.dynamoDb.send(new UpdateCommand(params));
      return result.Attributes as User;
    } catch (error) {
      console.log(`Error updating user score for userId: ${userId}`, error);
      throw new Error('Unable to update user score');
    }
  }
}
