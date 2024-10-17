import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './users.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUser(userId: string): Promise<User | null> {
    try {
      return await this.usersRepository.getUser(userId);
    } catch {
      throw new HttpException(
        'Unable to fetch user score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(name: string, userId: string): Promise<User> {
    try {
      return await this.usersRepository.createUser(name, userId);
    } catch {
      throw new HttpException(
        'Unable to create user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUserScore(userId: string, correctGuess: boolean): Promise<User> {
    try {
      return await this.usersRepository.updateUserScore(userId, correctGuess);
    } catch {
      throw new HttpException(
        'Unable to update user score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
