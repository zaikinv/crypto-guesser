import { Controller, Get, Res, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PriceService } from './price.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('price')
@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @UseGuards(AuthGuard)
  @Get('current')
  @ApiOperation({ summary: 'Get the current Bitcoin price.' })
  @ApiHeader({
    name: 'x-api-key',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the current Bitcoin price.',
  })
  @ApiResponse({ status: 500, description: 'Error fetching price.' })
  async getCurrentPrice(@Res() res: Response): Promise<void> {
    try {
      const price = await this.priceService.getCurrentBTCPrice();
      res.status(HttpStatus.OK).json({ price });
    } catch (error) {
      console.log('Error fetching price', error.message);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Error fetching price' });
    }
  }
}
