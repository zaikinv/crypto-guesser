import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { v4 as uuidv4 } from 'uuid';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':userId/score')
  @ApiOperation({ summary: 'Get the score of a user by userId.' })
  @ApiParam({ name: 'userId', type: String, description: 'The ID of the user' })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({ status: 200, description: 'Successfully fetched user score.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Error fetching score.' })
  async getUserScore(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const user = await this.usersService.getUser(userId);
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
        return;
      }
      res.status(HttpStatus.OK).json({ score: user.score });
    } catch (error) {
      console.error('Error fetching user score', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error fetching score' });
    }
  }

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new user with a unique userId.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'John Doe',
          description: 'The name of the user',
        },
      },
      required: ['name'],
    },
  })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 500, description: 'Error creating user.' })
  async createUser(
    @Body('name') name: string,
    @Res() res: Response,
  ): Promise<void> {
    const userId = uuidv4();
    try {
      const newUser = await this.usersService.createUser(name, userId);
      res.status(HttpStatus.CREATED).json({
        userId: newUser.userId,
        name: newUser.name,
        score: newUser.score,
      });
    } catch (error) {
      console.error('Error creating user', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error creating user' });
    }
  }
}
