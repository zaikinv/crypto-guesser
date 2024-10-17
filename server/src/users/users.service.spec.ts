import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from './users.interface';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUser: jest.fn(),
            createUser: jest.fn(),
            updateUserScore: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  describe('getUser', () => {
    it('should return a user if the repository call is successful', async () => {
      const mockUser: User = {
        userId: 'testUser',
        name: 'John Doe',
        score: 100,
      };

      (usersRepository.getUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.getUser('testUser');

      expect(result).toEqual(mockUser);
      expect(usersRepository.getUser).toHaveBeenCalledWith('testUser');
    });

    it('should throw an HttpException if the repository call fails', async () => {
      (usersRepository.getUser as jest.Mock).mockRejectedValue(new Error());

      await expect(usersService.getUser('testUser')).rejects.toThrow(
        new HttpException(
          'Unable to fetch user score',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('createUser', () => {
    it('should return the created user if repository call is successful', async () => {
      const mockUser: User = { userId: 'testUser', name: 'John Doe', score: 0 };

      (usersRepository.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await usersService.createUser('John Doe', 'testUser');

      expect(result).toEqual(mockUser);
      expect(usersRepository.createUser).toHaveBeenCalledWith(
        'John Doe',
        'testUser',
      );
    });

    it('should throw an HttpException if the repository call fails', async () => {
      (usersRepository.createUser as jest.Mock).mockRejectedValue(new Error());

      await expect(
        usersService.createUser('John Doe', 'testUser'),
      ).rejects.toThrow(
        new HttpException(
          'Unable to create user',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateUserScore', () => {
    it('should return the updated user if repository call is successful', async () => {
      const mockUser: User = {
        userId: 'testUser',
        name: 'John Doe',
        score: 101,
      };

      (usersRepository.updateUserScore as jest.Mock).mockResolvedValue(
        mockUser,
      );

      const result = await usersService.updateUserScore('testUser', true);

      expect(result).toEqual(mockUser);
      expect(usersRepository.updateUserScore).toHaveBeenCalledWith(
        'testUser',
        true,
      );
    });

    it('should throw an HttpException if the repository call fails', async () => {
      (usersRepository.updateUserScore as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await expect(
        usersService.updateUserScore('testUser', true),
      ).rejects.toThrow(
        new HttpException(
          'Unable to update user score',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
