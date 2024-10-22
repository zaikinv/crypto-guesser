import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DIRECTION, Guess } from './guess.interface';
import { PriceService } from '../price/price.service';
import { UsersService } from '../users/users.service';
import { GuessRepository } from './guess.repository';
import { appConfig } from '../config';

@Injectable()
export class GuessService {
  constructor(
    private readonly priceService: PriceService,
    private readonly usersService: UsersService,
    private readonly guessRepository: GuessRepository,
  ) {}

  async submitGuess(
    userId: string,
    direction: DIRECTION,
    price: number,
  ): Promise<{ message: string; guessId: string }> {
    const activeGuess = await this.guessRepository.getActiveGuess(userId);

    if (activeGuess) {
      const timeElapsed = Date.now() - activeGuess.timestamp;
      if (timeElapsed > appConfig.guessTimeout) {
        // when submitting a new guess after the timeout, delete the old guess
        await this.guessRepository.deleteGuess(userId);
      } else {
        throw new HttpException(
          {
            message: 'Guess already submitted',
            timestamp: activeGuess.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const guessId = uuidv4();

    await this.guessRepository.createGuess({
      guessId,
      userId,
      direction,
      price,
      timestamp: Date.now(),
    });

    return { message: 'Guess submitted', guessId };
  }

  async validateGuess(guessId: string): Promise<any> {
    const guess = await this.guessRepository.getGuess(guessId);
    if (!guess) {
      return { message: 'No guess with given ID found' };
    }

    return await this.resolveGuess(guess);
  }

  async getActiveGuess(userId: string): Promise<Guess | null> {
    const activeGuess = await this.guessRepository.getActiveGuess(userId);

    if (!activeGuess) {
      return null;
    }

    return activeGuess;
  }

  // Transactional function to resolve the guess
  // 1. Check if the guess is expired
  // 2. Get the current price
  // 3. Update the guess with the result
  // 4. Update the user score
  // 5. Delete the guess
  private async resolveGuess(activeGuess: Guess) {
    const { userId, guessId, price, direction, timestamp } = activeGuess;

    if (Date.now() - timestamp < appConfig.guessTimeout * 1000) {
      throw new HttpException(
        'Wait for more time before resolving the guess',
        HttpStatus.BAD_REQUEST,
      );
    }

    const currentPrice = await this.priceService.getCurrentBTCPrice();
    const isCorrectGuess = this.isGuessCorrect(currentPrice, price, direction);

    await this.guessRepository.updateGuess(guessId, isCorrectGuess);
    await this.usersService.updateUserScore(userId, isCorrectGuess);
    await this.guessRepository.deleteGuess(guessId);

    return {
      currentPrice,
      guessPrice: price,
      direction: direction,
      isCorrectGuess,
    };
  }

  private isGuessCorrect(
    currentPrice: number,
    price: number,
    guess: string,
  ): boolean {
    if (currentPrice === price) return false;
    const priceWentUp = currentPrice > price;
    return (
      (guess === DIRECTION.UP && priceWentUp) ||
      (guess === DIRECTION.DOWN && !priceWentUp)
    );
  }
}
