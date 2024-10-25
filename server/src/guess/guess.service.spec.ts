import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { GuessService } from './guess.service';
import { PriceService } from '../price/price.service';
import { UsersService } from '../users/users.service';
import { GuessRepository } from './guess.repository';
import { DIRECTION } from './guess.interface';

jest.mock('../config', () => ({
  appConfig: {
    priceApiBaseUrl: 'https://api.binance.com/api/v3',
    guessTimeout: 1,
    symbol: 'BTCUSDT',
  },
}));

describe('GuessService', () => {
  let guessService: GuessService;
  let priceService: PriceService;
  let usersService: UsersService;
  let guessRepository: GuessRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuessService,
        {
          provide: PriceService,
          useValue: {
            getCurrentBTCPrice: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            updateUserScore: jest.fn(),
          },
        },
        {
          provide: GuessRepository,
          useValue: {
            getActiveGuess: jest.fn(),
            createGuess: jest.fn(),
            getGuess: jest.fn(),
            updateGuess: jest.fn(),
            deleteGuess: jest.fn(),
          },
        },
      ],
    }).compile();

    guessService = module.get<GuessService>(GuessService) as GuessService;
    priceService = module.get<PriceService>(PriceService) as PriceService;
    usersService = module.get<UsersService>(UsersService) as UsersService;
    guessRepository = module.get<GuessRepository>(
      GuessRepository,
    ) as GuessRepository;
  });

  describe('submitGuess', () => {
    it('should submit a new guess if no active guess exists', async () => {
      const userId = 'testUser';
      const direction = DIRECTION.UP;
      const price = 10000;

      (guessRepository.getActiveGuess as jest.Mock).mockResolvedValue(null);
      (guessRepository.createGuess as jest.Mock).mockResolvedValue(undefined);

      const result = await guessService.submitGuess(userId, direction, price);

      expect(result).toHaveProperty('message', 'Guess submitted');
      expect(result).toHaveProperty('guessId');
      expect(guessRepository.createGuess).toHaveBeenCalled();
    });

    it('should throw an error if an active guess exists within the timeout', async () => {
      const userId = 'testUser';
      const direction = DIRECTION.UP;
      const price = 10000;
      const activeGuess = {
        guessId: 'activeGuessId',
        userId,
        direction,
        price,
        timestamp: Date.now(),
      };

      (guessRepository.getActiveGuess as jest.Mock).mockResolvedValue(
        activeGuess,
      );

      await expect(
        guessService.submitGuess(userId, direction, price),
      ).rejects.toThrow(
        new HttpException(
          {
            message: 'Wait for more time before submitting the next guess.',
            timestamp: activeGuess.timestamp,
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });
  });

  describe('validateGuess', () => {
    it('should return no guess message if guessId does not exist', async () => {
      const guessId = 'nonExistentId';

      (guessRepository.getGuess as jest.Mock).mockResolvedValue(null);

      await expect(guessService.validateGuess(guessId)).rejects.toThrow(
        new HttpException(
          {
            message: 'No guess with given ID found.',
          },
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should resolve the guess if it exists', async () => {
      const guessId = 'testGuess';
      const guess = {
        guessId,
        userId: 'testUser',
        direction: DIRECTION.UP,
        price: 10000,
        timestamp: Date.now() - 5000,
      };
      const currentPrice = 10500;

      (guessRepository.getGuess as jest.Mock).mockResolvedValue(guess);
      (priceService.getCurrentBTCPrice as jest.Mock).mockResolvedValue(
        currentPrice,
      );
      (guessRepository.updateGuess as jest.Mock).mockResolvedValue(undefined);
      (usersService.updateUserScore as jest.Mock).mockResolvedValue(undefined);
      (guessRepository.deleteGuess as jest.Mock).mockResolvedValue(undefined);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const result = await guessService.validateGuess(guessId);

      expect(result).toEqual({
        currentPrice,
        guessPrice: guess.price,
        direction: guess.direction,
        isCorrectGuess: true,
      });
      expect(guessRepository.updateGuess).toHaveBeenCalled();
      expect(usersService.updateUserScore).toHaveBeenCalled();
      expect(guessRepository.deleteGuess).toHaveBeenCalledWith(guessId);
    });
  });

  describe('getActiveGuess', () => {
    it('should return active guess if it exists', async () => {
      const userId = 'testUser';
      const activeGuess = {
        guessId: 'activeGuessId',
        userId,
        direction: DIRECTION.UP,
        price: 10000,
        timestamp: Date.now(),
      };

      (guessRepository.getActiveGuess as jest.Mock).mockResolvedValue(
        activeGuess,
      );

      const result = await guessService.getActiveGuess(userId);

      expect(result).toEqual(activeGuess);
    });

    it('should return null if no active guess exists', async () => {
      const userId = 'testUser';

      (guessRepository.getActiveGuess as jest.Mock).mockResolvedValue(null);

      const result = await guessService.getActiveGuess(userId);

      expect(result).toBeNull();
    });
  });
});
