import {
  Controller,
  Post,
  Param,
  Body,
  Res,
  HttpStatus,
  Patch,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { Response } from 'express';
import { GuessService } from './guess.service';
import { DIRECTION } from './guess.interface';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('guess')
@Controller('guess')
export class GuessController {
  constructor(private readonly guessService: GuessService) {}

  @UseGuards(AuthGuard)
  @Post('/submit')
  @ApiOperation({
    summary: 'Submit a direction for the current Bitcoin price.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {
          type: 'string',
          description: 'The ID of the user',
        },
        direction: {
          type: 'string',
          enum: ['up', 'down'],
          description: 'The user’s direction, either "up" or "down"',
        },
        price: {
          type: 'number',
          description: 'The price at the time of direction',
        },
      },
    },
  })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({ status: 200, description: 'Guess submitted successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async submitGuess(
    @Body('userId') userId: string,
    @Body('direction') direction: DIRECTION,
    @Body('price') price: number,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.guessService.submitGuess(
        userId,
        direction,
        price,
      );
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Patch('/validate/:guessId')
  @ApiOperation({ summary: "Validate the user's guess." })
  @ApiParam({
    name: 'guessId',
    type: String,
    description: 'The ID of the guess',
  })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({ status: 200, description: 'Guess validated successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async validateGuess(
    @Param('guessId') guessId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const result = await this.guessService.validateGuess(guessId);
      res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/active/:userId')
  @ApiOperation({ summary: "Get the user's active guess." })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The ID of the user',
  })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({
    status: 200,
    description: 'Active guess retrieved successfully.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getActiveGuess(
    @Param('userId') userId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const activeGuess = await this.guessService.getActiveGuess(userId);
      res.status(HttpStatus.OK).json(activeGuess);
    } catch (error) {
      res
        .status(error.status || HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
