import { Injectable } from '@nestjs/common';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Guess } from './guess.interface';

@Injectable()
export class GuessRepository {
  private readonly tableName = 'Guesses';
  private dynamoDb: DynamoDBDocumentClient;

  constructor(dynamoDbClient: DynamoDBDocumentClient) {
    this.dynamoDb = dynamoDbClient;
  }

  async createGuess(guessData: Guess): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: {
        ...guessData,
      },
    };
    await this.dynamoDb.send(new PutCommand(params));
  }

  async getActiveGuess(userId: string): Promise<Guess | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId,
      },
      ScanIndexForward: false,
      Limit: 1,
    };

    const result = await this.dynamoDb.send(new QueryCommand(params));
    return result.Items && result.Items.length > 0
      ? (result.Items[0] as Guess)
      : null;
  }

  async getGuess(guessId: string): Promise<Guess | null> {
    const params = {
      TableName: this.tableName,
      Key: { guessId },
    };

    const result = await this.dynamoDb.send(new GetCommand(params));
    return result.Item ? (result.Item as Guess) : null;
  }

  async updateGuess(guessId: string, correct: boolean): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { guessId },
      UpdateExpression: 'set correct = :correct',
      ExpressionAttributeValues: { ':correct': correct },
    };
    await this.dynamoDb.send(new UpdateCommand(params));
  }

  async deleteGuess(guessId: string): Promise<void> {
    const params = { TableName: this.tableName, Key: { guessId } };
    await this.dynamoDb.send(new DeleteCommand(params));
  }
}
