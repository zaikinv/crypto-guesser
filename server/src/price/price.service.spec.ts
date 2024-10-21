import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PriceService } from './price.service';
import { appConfig } from '../config';

jest.mock('axios');

jest.mock('../config', () => ({
  appConfig: {
    priceApiBaseUrl: 'https://api.binance.com/api/v3',
    guessTimeout: 1,
    symbol: 'BTCUSDT',
  },
}));

describe('PriceService', () => {
  let priceService: PriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceService],
    }).compile();

    priceService = module.get<PriceService>(PriceService) as PriceService;
  });

  describe('getCurrentBTCPrice', () => {
    it('should return the current BTC price when the API call is successful', async () => {
      const mockPrice = '50000.00';
      (axios.get as jest.Mock).mockResolvedValue({
        data: { price: mockPrice },
      });

      const result = await priceService.getCurrentBTCPrice();

      expect(result).toBe(parseFloat(mockPrice));
      expect(axios.get).toHaveBeenCalledWith(
        `${appConfig.priceApiBaseUrl}/ticker/price`,
        {
          params: {
            symbol: 'BTCUSDT',
          },
        },
      );
    });

    it('should throw an HttpException when the API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(priceService.getCurrentBTCPrice()).rejects.toThrow(
        new HttpException(
          'Error fetching price',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );

      expect(axios.get).toHaveBeenCalledWith(
        `${appConfig.priceApiBaseUrl}/ticker/price`,
        {
          params: {
            symbol: 'BTCUSDT',
          },
        },
      );
    });
  });
});
